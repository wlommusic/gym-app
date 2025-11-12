import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
// 1. Import useTheme
import { Appbar, Text, List, useTheme } from 'react-native-paper';
import { useRealm, useQuery } from '@realm/react';
import { Workout, Exercise, WorkoutExercise } from '../models';
import { BSON } from 'realm';
import { defaultExercises } from '../data/seedExercises';

const SelectExerciseScreen = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const realm = useRealm();
  // 2. Get the theme
  const theme = useTheme();

  const allExercises = useQuery(Exercise, exercises => {
    return exercises.sorted('name');
  });

  if (allExercises.length === 0) {
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
    navigation.navigate('CreateExercise');
  };

  const onSelectExercise = selectedExercise => {
    realm.write(() => {
      const activeWorkout = realm.objectForPrimaryKey(
        Workout,
        new BSON.ObjectId(workoutId),
      );
      if (activeWorkout) {
        const newWorkoutExercise = realm.create('WorkoutExercise', {
          exercise: selectedExercise,
        });
        activeWorkout.workoutExercises.push(newWorkoutExercise);
      }
    });
    navigation.goBack();
  };

  return (
    // 3. Apply the theme's background color
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Select Exercise" />
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