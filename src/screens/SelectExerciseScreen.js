import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text, List, useTheme } from 'react-native-paper';
import { useRealm, useQuery } from '@realm/react';
import { Workout, Exercise, WorkoutExercise } from '../models';
import { BSON } from 'realm';
import { defaultExercises } from '../data/seedExercises';

const SelectExerciseScreen = ({ navigation, route }) => {
  const { bodyPart, workoutId } = route.params || {};
  const realm = useRealm();
  const theme = useTheme();

  const allExercises = useQuery(Exercise, exercises => {
    return exercises
      .filtered("primary_muscle_group == $0", bodyPart)
      .sorted('name');
  });

  // Seeder logic (unchanged)
  if (allExercises.length === 0 && bodyPart === 'Chest') {
    realm.write(() => {
      defaultExercises.forEach(exercise => {
        realm.create('Exercise', exercise);
      });
    });
  }

  const goBack = () => {
    navigation.goBack();
  };

  const onNavigateToCreate = () => {
    // We'll also pass the bodyPart to the Create screen
    // so it can pre-fill the muscle group field.
    navigation.navigate('CreateExercise', {
      prefilledMuscleGroup: bodyPart,
    });
  };

  const onSelectExercise = selectedExercise => {
    let workoutToUpdate;

    if (workoutId) {
      // Resuming a workout
      workoutToUpdate = realm.objectForPrimaryKey(
        Workout,
        new BSON.ObjectId(workoutId),
      );
    } else {
      // --- THIS IS THE CHANGE ---
      // This is the FIRST exercise, so we create a new workout
      // AND save the primary_muscle_group.
      realm.write(() => {
        workoutToUpdate = realm.create('Workout', {
          date: new Date(),
          status: 'pending',
          primary_muscle_group: selectedExercise.primary_muscle_group, // <-- We save it here
        });
      });
      // --- END CHANGE ---
    }

    // Add the exercise to the workout
    realm.write(() => {
      if (workoutToUpdate) {
        const newWorkoutExercise = realm.create('WorkoutExercise', {
          exercise: selectedExercise,
        });
        workoutToUpdate.workoutExercises.push(newWorkoutExercise);
      }
    });

    // Navigate to the logging screen
    navigation.navigate('WorkoutLogging', {
      workoutId: workoutToUpdate._id.toString(),
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title={`Select ${bodyPart}`} />
        <Appbar.Action icon="plus" onPress={onNavigateToCreate} />
      </Appbar.Header>

      <FlatList
        data={allExercises}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.primary_muscle_group} | ${item.equipment}`}
            onPress={() => onSelectExercise(item)}
          />
        )}
        keyExtractor={item => item._id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No exercises found for {bodyPart}.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SelectExerciseScreen;