import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform, LogBox, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme, List, Switch, Card, IconButton, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm, useObject } from '@realm/react';
import { WorkoutTemplate } from '../models';
import { BSON } from 'realm';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CreateWorkoutSplitScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const realm = useRealm();

  const { templateId } = route.params || {};
  const existingTemplate = templateId ? useObject(WorkoutTemplate, new BSON.ObjectId(templateId)) : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dailyWorkouts, setDailyWorkouts] = useState(() =>
    daysOfWeek.map(day => ({
      day_of_week: day,
      workout_title: '',
      is_rest_day: true,
      exercises: []
    }))
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (templateId && existingTemplate && !isLoaded) {
      setName(existingTemplate.name);
      setDescription(existingTemplate.description || '');
      const loadedDays = existingTemplate.dailyWorkouts.map(dw => ({
        day_of_week: dw.day_of_week,
        workout_title: dw.workout_title,
        is_rest_day: dw.is_rest_day,
        exercises: dw.exercises.map(ex => ({
          exercise_name: ex.exercise_name,
          sets: ex.sets,
          reps_or_time: ex.reps_or_time,
          order: ex.order
        }))
      }));
      setDailyWorkouts(loadedDays);
      setIsLoaded(true);
    }
  }, [existingTemplate, templateId, isLoaded]);

  const handleExerciseAdded = (dayIndex, exerciseData) => {
    setDailyWorkouts(current => {
      const newDaily = current.map((day, idx) => {
        if (idx !== dayIndex) return day;
        const updatedDay = { ...day };
        updatedDay.is_rest_day = false;
        if (!updatedDay.workout_title) updatedDay.workout_title = `${updatedDay.day_of_week} Workout`;
        updatedDay.exercises = [...updatedDay.exercises, exerciseData];
        return updatedDay;
      });
      return newDaily;
    });
  };

  const updateDayField = (index, field, value) => {
    setDailyWorkouts(current => {
      const newDaily = [...current];
      newDaily[index] = { ...newDaily[index], [field]: value };
      return newDaily;
    });
  };

  const removeExercise = (dayIndex, exerciseOrder) => {
    setDailyWorkouts(current => {
      const newDaily = current.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          exercises: day.exercises.filter(e => e.order !== exerciseOrder)
        };
      });
      return newDaily;
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the split.');
      return;
    }
    realm.write(() => {
      if (templateId && existingTemplate) {
        existingTemplate.name = name;
        existingTemplate.description = description;
        realm.delete(existingTemplate.dailyWorkouts);
        existingTemplate.dailyWorkouts = dailyWorkouts.map(dw => realm.create('DailyWorkout', {
          ...dw,
          _id: new BSON.ObjectId(),
          exercises: dw.exercises.map(ex => realm.create('TemplateExercise', { ...ex, _id: new BSON.ObjectId() }))
        }));
      } else {
        const newTemplate = realm.create('WorkoutTemplate', {
          _id: new BSON.ObjectId(),
          name,
          description,
          is_custom: true,
          is_active: false,
          created_at: new Date(),
          dailyWorkouts: []
        });
        newTemplate.dailyWorkouts = dailyWorkouts.map(dw => realm.create('DailyWorkout', {
          ...dw,
          _id: new BSON.ObjectId(),
          exercises: dw.exercises.map(ex => realm.create('TemplateExercise', { ...ex, _id: new BSON.ObjectId() }))
        }));
      }
    });
    navigation.goBack();
  };

  const renderDayItem = useCallback(({ item, index }) => {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <List.Accordion
          title={item.day_of_week}
          description={item.is_rest_day ? "Rest Day" : (item.workout_title || "No Title")}
          titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          left={props => <IconButton {...props} icon="calendar" iconColor={theme.colors.primary} />}
          style={{ backgroundColor: theme.colors.surface, paddingVertical: 0 }}
          theme={{ colors: { background: theme.colors.surface } }}
        >
          <Card.Content style={{ paddingTop: 0, paddingBottom: 16 }}>
            <Divider style={{ marginBottom: 16 }} />

            <View style={styles.rowBetween}>
              <Text style={{ fontSize: 16, color: theme.colors.onSurface }}>Rest Day?</Text>
              <Switch
                value={item.is_rest_day}
                onValueChange={() => {
                  setDailyWorkouts(current => {
                    const newDaily = [...current];
                    newDaily[index] = { ...newDaily[index], is_rest_day: !newDaily[index].is_rest_day };
                    return newDaily;
                  });
                }}
                color={theme.colors.primary}
              />
            </View>

            {!item.is_rest_day && (
              <View style={{ marginTop: 16 }}>
                <TextInput
                  label="Workout Title"
                  value={item.workout_title}
                  onChangeText={(text) => updateDayField(index, 'workout_title', text)}
                  mode="outlined"
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  textColor={theme.colors.onSurface}
                />

                <View style={[styles.exerciseListContainer, { backgroundColor: theme.colors.elevation.level1, borderColor: theme.colors.outlineVariant }]}>
                  <Text style={[styles.subHeader, { color: theme.colors.onSurfaceVariant }]}>Exercises</Text>

                  {item.exercises.length === 0 ? (
                    <Text style={{ color: theme.colors.onSurfaceDisabled, fontStyle: 'italic', marginBottom: 8, paddingHorizontal: 4 }}>No exercises added.</Text>
                  ) : (
                    // --- NESTED SCROLLVIEW FIX ---
                    <ScrollView
                      style={{ maxHeight: 250 }}
                      nestedScrollEnabled={true} // Child needs this
                      showsVerticalScrollIndicator={true}
                    >
                      {item.exercises.map((ex) => (
                        <View key={ex.order} style={[styles.exerciseRow, { borderBottomColor: theme.colors.outlineVariant }]}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600', color: theme.colors.onSurface }}>{ex.exercise_name}</Text>
                            <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>{ex.sets} sets × {ex.reps_or_time}</Text>
                          </View>
                          <IconButton
                            icon="delete-outline"
                            size={20}
                            iconColor={theme.colors.error}
                            onPress={() => removeExercise(index, ex.order)}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>

                <Button
                  mode="tonal"
                  icon="plus"
                  onPress={() => navigation.navigate('AddExerciseToSplitScreen', {
                    dayIndex: index,
                    onExerciseAdded: (data) => handleExerciseAdded(index, data)
                  })}
                  style={{ marginTop: 8 }}
                >
                  Add Exercise
                </Button>
              </View>
            )}
          </Card.Content>
        </List.Accordion>
      </Card>
    );
  }, [dailyWorkouts, theme, navigation]);

  if (templateId && !isLoaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => navigation.goBack()} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>{templateId ? "Edit Split" : "Create Split"}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.onPrimary, opacity: 0.8 }]}>Customize your schedule</Text>
        </View>
        <Button mode="text" textColor={theme.colors.onPrimary} onPress={handleSave} labelStyle={{ fontWeight: 'bold' }}>
          Save
        </Button>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <FlatList
          data={dailyWorkouts}
          renderItem={renderDayItem}
          keyExtractor={(item) => item.day_of_week}
          extraData={dailyWorkouts}
          contentContainerStyle={{ paddingBottom: 40 }}

          // --- PARENT SCROLL FIXES ---
          nestedScrollEnabled={true} // Allow children to scroll
          removeClippedSubviews={false} // Prevents rendering glitches with nested lists
          keyboardShouldPersistTaps="handled" // Ensures buttons work while keyboard is open

          ListHeaderComponent={
            <Card style={[styles.metaCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <TextInput
                  label="Split Name"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={[styles.input, { backgroundColor: theme.colors.surface, marginBottom: 12 }]}
                  textColor={theme.colors.onSurface}
                />
                <TextInput
                  label="Description (Optional)"
                  value={description}
                  onChangeText={setDescription}
                  mode="outlined"
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  textColor={theme.colors.onSurface}
                />
              </Card.Content>
            </Card>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    elevation: 4,
    marginBottom: 10
  },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 12 },
  metaCard: { margin: 16, marginBottom: 8, elevation: 2 },
  card: { marginHorizontal: 16, marginBottom: 12, elevation: 1, overflow: 'hidden' },
  input: {},
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseListContainer: { marginTop: 16, padding: 8, borderRadius: 8, borderWidth: 1 },
  subHeader: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
});

export default CreateWorkoutSplitScreen;