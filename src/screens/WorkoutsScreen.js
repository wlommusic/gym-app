import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, Text, useTheme } from 'react-native-paper';
import { useQuery } from '@realm/react';
import { Workout } from '../models';

const WorkoutsScreen = () => {
  const theme = useTheme();

  const completedWorkouts = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'completed'").sorted('date', true);
  });

  const getExerciseNames = (workoutExercises) => {
    if (!workoutExercises || workoutExercises.length === 0) {
      return "No exercises logged";
    }
    const names = workoutExercises.map(we => we.exercise?.name || 'Unknown');
    return names.join(', ');
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Workout History" />
      </Appbar.Header>

      <FlatList
        data={completedWorkouts}
        keyExtractor={item => item._id.toString()}

        // --- THIS IS THE FIX (Removed the extra 'D') ---
        renderItem={({ item }) => (
          <List.Item
            title={item.name || item.date.toDateString()}
            description={getExerciseNames(item.workoutExercises)}
            descriptionNumberOfLines={2}
          />
        )}
        // --- END FIX ---

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