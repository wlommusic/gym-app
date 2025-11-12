import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text, Button, List } from 'react-native-paper';
import { useRealm, useObject } from '@realm/react';
import { Workout } from '../models';
import { BSON } from 'realm';

const WorkoutLoggingScreen = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const realm = useRealm();

  // This "live" hook is what makes this work
  const activeWorkout = useObject(Workout, new BSON.ObjectId(workoutId));

  const goBack = () => {
    navigation.goBack();
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

    navigation.goBack();
  };

  const onAddExercise = () => {
    navigation.navigate('SelectExercise', {
      workoutId: workoutId,
    });
  };

  const onSelectWorkoutExercise = (workoutExerciseId) => {
    navigation.navigate('LogSet', {
      workoutExerciseId: workoutExerciseId.toString(),
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Log Workout" />
        <Appbar.Action icon="check" onPress={onFinishWorkout} />
      </Appbar.Header>

      <FlatList
        data={activeWorkout?.workoutExercises}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.exercise?.name || 'Exercise not found'}

            // --- THIS IS THE CHANGE ---
            // We read the length of the 'sets' list
            description={`${item.sets.length} sets`}
            // --- END CHANGE ---

            onPress={() => onSelectWorkoutExercise(item._id)}
          />
        )}
        ListFooterComponent={
          <Button
            icon="plus"
            mode="contained"
            onPress={onAddExercise}
            style={{ margin: 16 }}>
            Add Exercise
          </Button>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WorkoutLoggingScreen;