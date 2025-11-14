import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Appbar, Text, Button, List, useTheme, Divider } from 'react-native-paper';
import { useRealm, useObject } from '@realm/react';
import { Workout } from '../models';
import { BSON } from 'realm';

const WorkoutLoggingScreen = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const realm = useRealm();
  const theme = useTheme();

  const activeWorkout = useObject(Workout, new BSON.ObjectId(workoutId));
  const isEditing = activeWorkout?.status === 'pending';

  const goBack = () => {
    navigation.popToTop();
  };

  const onFinishWorkout = () => {
    realm.write(() => {
      const workoutToUpdate = realm.objectForPrimaryKey(
        Workout,
        new BSON.ObjectId(workoutId),
      );
      if (workoutToUpdate) {
        workoutToUpdate.status = 'completed';
        workoutToUpdate.updated_at = new Date();
      }
    });
    navigation.popToTop();
  };

  const onDeleteWorkout = () => {
    Alert.alert(
      "Delete Workout?",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            realm.write(() => {
              if (activeWorkout) {
                realm.delete(activeWorkout);
              }
            });
            navigation.popToTop();
          },
        },
      ]
    );
  };

  const onEnableEditing = () => {
    realm.write(() => {
      if (activeWorkout) {
        activeWorkout.status = 'pending';
      }
    });
  };

  const onAddExercise = () => {
    navigation.navigate('SelectBodyPart', {
      workoutId: workoutId,
    });
  };

  const onSelectWorkoutExercise = (workoutExerciseId) => {
    navigation.navigate('LogSet', {
      workoutExerciseId: workoutExerciseId.toString(),
      isEditing: isEditing,
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title={isEditing ? "Current Workout" : "Workout Summary"} />

        {isEditing ? (
          <Appbar.Action icon="check" onPress={onFinishWorkout} />
        ) : (
          <Appbar.Action icon="pencil" onPress={onEnableEditing} />
        )}
      </Appbar.Header>

      <FlatList
        data={activeWorkout?.workoutExercises}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.exercise?.name || 'Exercise not found'}
            description={`${item.sets.length} sets`}
            onPress={() => onSelectWorkoutExercise(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="headlineSmall">Workout is empty</Text>
            {isEditing && (
              <Text variant="bodyLarge" style={styles.emptyText}>
                Tap "Add Exercise" to begin.
              </Text>
            )}
          </View>
        }

        // --- THIS IS THE FIX ---
        // The conditional logic must be INSIDE the prop
        ListFooterComponent={() => {
          // If we are not editing, render nothing
          if (!isEditing) {
            return null;
          }

          // If we are editing, render the buttons
          return (
            <View style={styles.footerContainer}>
              <Button
                icon="plus"
                mode="contained"
                onPress={onAddExercise}
                style={styles.footerButton}>
                Add Exercise
              </Button>

              <Divider style={styles.divider} />

              <Button
                icon="delete"
                mode="outlined"
                onPress={onDeleteWorkout}
                style={styles.footerButton}
                textColor={theme.colors.error}
                borderColor={theme.colors.error}
              >
                Delete Workout
              </Button>
            </View>
          );
        }}
        // --- END FIX ---
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    marginTop: 8,
    color: 'gray',
  },
  footerContainer: {
    padding: 16,
  },
  footerButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
});

export default WorkoutLoggingScreen;