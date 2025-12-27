import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text, IconButton, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@realm/react';
import { Exercise } from '../models';

const AddExerciseToSplitScreen = ({ navigation, route }) => {
  const theme = useTheme();

  // FIX: We receive the callback function
  const { onExerciseAdded } = route.params;

  const exercises = useQuery(Exercise, e => e.sorted('name'));
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState('');
  const [repsOrTime, setRepsOrTime] = useState('');

  const onSave = () => {
    if (!sets.trim() || !repsOrTime.trim()) {
      Alert.alert('Error', 'Please fill out both Sets and Reps/Time.');
      return;
    }

    // FIX: Call the function from the previous screen
    // This updates the data inside CreateWorkoutSplitScreen directly
    onExerciseAdded({
      exercise_name: selectedExercise.name,
      sets,
      reps_or_time: repsOrTime,
      order: Date.now(),
    });

    // FIX: Just go back (pop the stack)
    // This ensures we land exactly where we left off
    navigation.goBack();
  };

  // --- RENDER 1: SELECT EXERCISE LIST ---
  if (!selectedExercise) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => navigation.goBack()} />
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>Select Exercise</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.onPrimary, opacity: 0.8 }]}>Choose an exercise for this day</Text>
          </View>
          <View style={{ width: 48 }} />
        </View>

        <FlatList
          data={exercises}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={() => setSelectedExercise(item)}>
              <Card.Title
                title={item.name}
                titleStyle={{ fontWeight: '600', color: theme.colors.onSurface }}
                subtitle={item.primary_muscle_group || 'General'}
                subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                left={(props) => <IconButton {...props} icon="dumbbell" size={24} iconColor={theme.colors.primary} />}
                right={(props) => <IconButton {...props} icon="chevron-right" size={20} iconColor={theme.colors.onSurfaceVariant} />}
              />
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>No exercises found.</Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  // --- RENDER 2: CONFIGURE SETS & REPS ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
       <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => setSelectedExercise(null)} />
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>{selectedExercise.name}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.onPrimary, opacity: 0.8 }]}>Configure Volume</Text>
          </View>
          <View style={{ width: 48 }} />
        </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <TextInput
                label="Target Sets"
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
                mode="outlined"
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                textColor={theme.colors.onSurface}
              />
              <TextInput
                label="Target Reps or Time"
                value={repsOrTime}
                onChangeText={setRepsOrTime}
                placeholder="e.g. 8-12 or 30s"
                mode="outlined"
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                textColor={theme.colors.onSurface}
              />

              <Button
                mode="contained"
                onPress={onSave}
                style={styles.button}
                contentStyle={{ height: 50 }}
              >
                Add to Split
              </Button>
            </Card.Content>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  card: { marginBottom: 10, elevation: 1 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  formContainer: { padding: 16 },
  formCard: { elevation: 2 },
  input: { marginBottom: 16 },
  button: { marginTop: 8 },
});

export default AddExerciseToSplitScreen;