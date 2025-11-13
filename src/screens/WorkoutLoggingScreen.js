import React from 'react';
// 1. Import Alert
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Appbar, Text, Button, List, useTheme } from 'react-native-paper';
import { useRealm, useObject } from '@realm/react';
import { Workout } from '../models';
import { BSON } from 'realm';

const WorkoutLoggingScreen = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const realm = useRealm();
  const theme = useTheme();

  const activeWorkout = useObject(Workout, new BSON.ObjectId(workoutId));

  // --- THIS IS THE "FINISH" FIX ---
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
    // 2. We use popToTop() to go all the way back to the
    //    first screen in the stack (HomeScreen).
    navigation.popToTop();
  };
  // --- END FIX ---

  // --- THIS IS THE "CANCEL" FIX ---
  const onCancelWorkout = () => {
    Alert.alert(
      "Cancel Workout?",
      "Are you sure? This will delete this pending workout.",
      [
        // The "No" button
        { text: "No", style: "cancel" },
        // The "Yes" button
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            realm.write(() => {
              if (activeWorkout) {
                // We delete the entire workout object
                realm.delete(activeWorkout);
              }
            });
            // 3. Go all the way back to Home
            navigation.popToTop();
          },
        },
      ]
    );
  };
  // --- END FIX ---

  const onAddExercise = () => {
    navigation.navigate('SelectBodyPart', {
      workoutId: workoutId,
    });
  };

  const onSelectWorkoutExercise = (workoutExerciseId) => {
    navigation.navigate('LogSet', {
      workoutExerciseId: workoutExerciseId.toString(),
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        {/* 4. Hook up the Back button to our new Cancel function */}
        <Appbar.BackAction onPress={onCancelWorkout} />
        <Appbar.Content title="Log Workout" />
        {/* 5. Hook up the Check button to our new Finish function */}
        <Appbar.Action icon="check" onPress={onFinishWorkout} />
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
            <Text variant="bodyLarge" style={styles.emptyText}>
              Tap "Add Exercise" to begin.
            </Text>
          </View>
        }
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
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    marginTop: 8,
    color: 'gray',
  },
});

export default WorkoutLoggingScreen;