import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text, Button, List } from 'react-native-paper';
import { useRealm, useObject } from '@realm/react';
import { Workout } from '../models';
import { BSON } from 'realm';

// 1. Receive 'navigation' prop
const WorkoutLoggingScreen = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const realm = useRealm();

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

  // --- NEW FUNCTION ---
  // 2. This function handles tapping on an exercise
  const onSelectWorkoutExercise = (workoutExerciseId) => {
    // 3. Navigate to the LogSet screen, passing the ID
    navigation.navigate('LogSet', {
      workoutExerciseId: workoutExerciseId.toString(),
    });
  };
  // --- END NEW FUNCTION ---

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
            description="0 sets" // We'll make this dynamic later

            // --- THIS IS THE CHANGE ---
            // 4. Hook up the onPress event
            onPress={() => onSelectWorkoutExercise(item._id)}
            // --- END CHANGE ---
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