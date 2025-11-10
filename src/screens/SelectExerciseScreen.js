import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text, List } from 'react-native-paper';
import { useRealm, useQuery } from '@realm/react';
import { Workout, Exercise, WorkoutExercise } from '../models';
import { BSON } from 'realm';

// --- NEW IMPORT ---
// 1. Import our seed data
import { defaultExercises } from '../data/seedExercises';
// --- END NEW IMPORT ---

const SelectExerciseScreen = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const realm = useRealm();

  // 2. This hook gets a "live" list of ALL exercises
  const allExercises = useQuery(Exercise, exercises => {
    return exercises.sorted('name');
  });

  // --- THIS IS THE FIX ---
  // 3. We check if the query returned an empty list.
  if (allExercises.length === 0) {
    // 4. If it's empty, run the seed logic right now.
    realm.write(() => {
      defaultExercises.forEach(exercise => {
        realm.create('Exercise', exercise);
      });
    });
    // The 'allExercises' hook will auto-update after this,
    // and the list will render.
  }
  // --- END FIX ---

  const goBack = () => {
    navigation.goBack();
  };

  // This runs when a user taps on an exercise.
  const onSelectExercise = selectedExercise => {
    realm.write(() => {
      const activeWorkout = realm.objectForPrimaryKey(
        Workout,
        new BSON.ObjectId(workoutId),
      );

      if (!activeWorkout) {
        console.error('Could not find active workout');
        return;
      }

      // Create the new "WorkoutExercise"
      const newWorkoutExercise = realm.create('WorkoutExercise', {
        exercise: selectedExercise,
      });

      // Add it to the workout
      activeWorkout.workoutExercises.push(newWorkoutExercise);
    });

    // Go back to the logging screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Select Exercise" />
      </Appbar.Header>

      {/* FlatList will now get the data after the seed logic runs */}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SelectExerciseScreen;