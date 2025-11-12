import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, Text } from 'react-native-paper';
import { useQuery } from '@realm/react';
import { Workout } from '../models';

const WorkoutsScreen = () => {

  // This query finds all COMPLETED workouts, newest first.
  const completedWorkouts = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'completed'").sorted('date', true);
  });

  // --- NEW FUNCTION ---
  // 1. This helper function takes the list of exercises
  //    and turns it into a string.
  const getExerciseNames = (workoutExercises) => {
    if (!workoutExercises || workoutExercises.length === 0) {
      return "No exercises logged";
    }

    // 2. Map over the list, get each exercise's name.
    const names = workoutExercises.map(we => we.exercise?.name || 'Unknown');

    // 3. Join them all with a comma and a space.
    return names.join(', ');
  };
  // --- END NEW FUNCTION ---

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Workout History" />
      </Appbar.Header>

      <FlatList
        data={completedWorkouts}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.name || item.date.toDateString()}

            // --- THIS IS THE CHANGE ---
            // 4. Call our new helper function for the description
            description={getExerciseNames(item.workoutExercises)}
            // --- END CHANGE ---

            // Make the description wrap to multiple lines if needed
            descriptionNumberOfLines={2}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You haven't completed any workouts yet.
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

export default WorkoutsScreen;