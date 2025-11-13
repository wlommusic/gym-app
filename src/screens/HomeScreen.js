import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Button,
  Card,
  Text,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm, useQuery } from '@realm/react';
import { Workout } from '../models';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const today = new Date();
  const formattedDate = today.toDateString();
  const realm = useRealm();

  // This query is now only used to change the button's text
  const pendingWorkouts = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'pending'");
  });

  const completedWorkouts = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'completed'").sorted('date', true);
  });

  const lastWorkout = completedWorkouts[0];

  // --- THIS IS THE CHANGE ---
  // This function now creates a workout and navigates directly
  // to the logging screen.
  const onQuickStart = () => {
    let workoutToOpen;

    // We no longer check for a pending workout here.
    // "Quick Start" *always* creates a new one.
    // (We'll build the "Resume" logic into the horizontal list later)
    realm.write(() => {
      workoutToOpen = realm.create('Workout', {
        date: new Date(),
        status: 'pending',
      });
    });

    // Navigate to the logging screen with the new ID
    navigation.navigate('WorkoutLogging', {
      workoutId: workoutToOpen._id.toString(),
    });
  };
  // --- END CHANGE ---

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header (We'll remove the cog later) */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.primary },
        ]}>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hello, User!!!</Text>
          <Text style={styles.headerSubtitle}>{formattedDate}</Text>
        </View>

        <IconButton
          icon="cog"
          iconColor="#FFFFFF"
          onPress={() => { navigation.navigate('Profile') /* Go to new Profile tab */ }}
        />
      </View>

      <ScrollView style={styles.content}>

        <View style={styles.buttonRow}>
          <Button
            icon="play-circle"
            mode="contained"
            onPress={onQuickStart}
            style={styles.button}>
            {/* We'll simplify this text later */}
            {pendingWorkouts.length > 0 ? 'Resume Editing' : 'Quick Start'}
          </Button>
          <Button
            icon="clipboard-list"
            mode="outlined"
            onPress={() => { /* TODO: Open Templates */ }}
            style={styles.button}>
            Templates
          </Button>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Your Week" />
          <Card.Content>
            <Text variant="bodyMedium">🔥 0-Day Streak!</Text>
            <Text variant="bodyMedium">
              💪 {completedWorkouts.length} Workouts This Week
            </Text>
            <Text variant="bodyMedium">Overall Volume: 0 kg</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Last Workout" />
          <Card.Content>
            {lastWorkout ? (
              <View>
                <Text variant="bodyMedium">
                  {lastWorkout.date.toDateString()}
                </Text>
                <Text variant="bodyMedium">
                  {lastWorkout.workoutExercises.length} Exercises
                </Text>
              </View>
            ) : (
              <View>
                <Text variant="bodyMedium">You haven't logged any workouts yet.</Text>
                <Text variant="bodyMedium">Tap "Quick Start" to begin!</Text>
              </View>
            )}
          </Card.Content>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerContent: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    marginBottom: 16,
  },
});

export default HomeScreen;