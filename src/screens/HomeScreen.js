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

  // This hook finds all Workouts with the status "pending".
  const pendingWorkouts = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'pending'");
  });

  const onQuickStart = () => {
    let workoutToOpen;

    // Check if we found any pending workouts
    if (pendingWorkouts.length > 0) {
      // If yes, grab the first one to "resume" it
      workoutToOpen = pendingWorkouts[0];
    } else {
      // If no, create a new one
      realm.write(() => {
        workoutToOpen = realm.create('Workout', {
          date: new Date(),
          status: 'pending',
        });
      });
    }

    // Navigate to the logging screen with the correct ID
    navigation.navigate('WorkoutLogging', {
      workoutId: workoutToOpen._id.toString(),
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* 1. Custom Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: '#333333' },
        ]}>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hello, User!!!</Text>
          <Text style={styles.headerSubtitle}>{formattedDate}</Text>
        </View>

        <IconButton
          icon="cog"
          iconColor="#FFFFFF"
          onPress={() => { /* TODO: Open settings */ }}
        />
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.content}>

        {/* 2. Call to Action (Buttons) */}
        <View style={styles.buttonRow}>
          <Button
            icon="play-circle"
            mode="contained"
            onPress={onQuickStart}
            style={styles.button}>

            {/* --- THIS IS THE CHANGE --- */}
            {pendingWorkouts.length > 0 ? 'Resume Editing' : 'Quick Start'}
            {/* --- END CHANGE --- */}

          </Button>
          <Button
            icon="clipboard-list"
            mode="outlined"
            onPress={() => { /* TODO: Open Templates */ }}
            style={styles.button}>
            Templates
          </Button>
        </View>

        {/* 3. Section B: Progress Snapshot */}
        <Card style={styles.card}>
          <Card.Title title="Your Week" />
          <Card.Content>
            <Text variant="bodyMedium">🔥 0-Day Streak!</Text>
            <Text variant="bodyMedium">💪 0/3 Workouts This Week</Text>
            <Text variant="bodyMedium">Overall Volume: 0 kg</Text>
          </Card.Content>
        </Card>

        {/* 4. Section C: Last Workout Summary */}
        <Card style={styles.card}>
          <Card.Title title="Last Workout" />
          <Card.Content>
            <Text variant="bodyMedium">You haven't logged any workouts yet.</Text>
            <Text variant="bodyMedium">Tap "Quick Start" to begin!</Text>
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
    backgroundColor: '#333333',
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