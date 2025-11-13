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
    navigation.navigate('CreateExercise', {
      prefilledMuscleGroup: bodyPart,
    });
  };

  // --- THIS IS THE "LOOP" FIX ---
  const onSelectExercise = selectedExercise => {
    const workoutToUpdate = realm.objectForPrimaryKey(
      Workout,
      new BSON.ObjectId(workoutId),
    );

    realm.write(() => {
      if (workoutToUpdate) {
        const newWorkoutExercise = realm.create('WorkoutExercise', {
          exercise: selectedExercise,
        });
        workoutToUpdate.workoutExercises.push(newWorkoutExercise);
      }
    });

    // 1. Instead of navigating, we "pop" two screens:
    //    - 'SelectExerciseScreen' (this one)
    //    - 'SelectBodyPartScreen' (the one before it)
    //    This lands us back on 'WorkoutLoggingScreen'.
    navigation.pop(2);
  };
  // --- END FIX ---

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