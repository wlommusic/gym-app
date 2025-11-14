import React from 'react';
import { ScrollView, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {
  Button,
  Card,
  Text,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm, useQuery } from '@realm/react';
import { Workout, User } from '../models';

// --- NEW HELPER COMPONENT (Unchanged) ---
const WorkoutCard = ({ workout, onPress }) => {
  const getExerciseSummary = (workoutExercises) => {
    if (!workoutExercises || workoutExercises.length === 0) {
      return "No exercises";
    }
    const groups = workoutExercises.reduce((acc, we) => {
      const muscle = we.exercise?.primary_muscle_group || 'Other';
      acc[muscle] = (acc[muscle] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups)
      .map(([muscle, count]) => `${muscle} (${count})`)
      .join(', ');
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.workoutCard}>
        <Card.Content>
          <Text variant="titleMedium">{workout.name || workout.date.toDateString()}</Text>
          <Text variant="bodySmall" numberOfLines={2}>
            {getExerciseSummary(workout.workoutExercises)}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
// --- END HELPER COMPONENT ---


const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const today = new Date();
  const formattedDate = today.toDateString();
  const realm = useRealm();

  const users = useQuery(User);
  const user = users[0];

  const pendingWorkouts = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'pending'").sorted('date', true);
  });

  const completedWorkouts = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'completed'").sorted('date', true);
  });

  // --- NEW LOGIC: WORKOUTS THIS WEEK ---
  // 1. Get the date for the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // 2. Query for workouts completed this week
  const completedWorkoutsThisWeek = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'completed' AND date >= $0", startOfWeek);
  });
  // --- END NEW LOGIC ---

  const onQuickStart = () => {
    let newWorkout;
    realm.write(() => {
      newWorkout = realm.create('Workout', {
        date: new Date(),
        status: 'pending',
        user: user,
      });
    });

    navigation.navigate('WorkoutLogging', {
      workoutId: newWorkout._id.toString(),
    });
  };

  const onViewWorkout = (workoutId) => {
    navigation.navigate('WorkoutLogging', {
      workoutId: workoutId.toString(),
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header (Unchanged) */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.primary },
        ]}>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Hello, {user ? user.name : 'User'}!
          </Text>
          <Text style={styles.headerSubtitle}>{formattedDate}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>

        {/* Call to Action (Unchanged) */}
        <View style={styles.buttonRow}>
          <Button
            icon="play-circle"
            mode="contained"
            onPress={onQuickStart}
            style={styles.button}>
            Start New Workout
          </Button>
          <Button
            icon="clipboard-list"
            mode="outlined"
            onPress={() => { /* TODO: Open Templates */ }}
            style={styles.button}>
            Templates
          </Button>
        </View>

        {/* --- THIS IS THE NEW CARD --- */}
        {/* 3. Re-added the Progress Snapshot card */}
        <Card style={styles.card}>
          <Card.Title title="Your Week" />
          <Card.Content>
            {/* We'll make the streak dynamic later */}
            <Text variant="bodyMedium">🔥 0-Day Streak!</Text>
            {/* This count is now live */}
            <Text variant="bodyMedium">
              💪 {completedWorkoutsThisWeek.length} Workouts This Week
            </Text>
          </Card.Content>
        </Card>
        {/* --- END NEW CARD --- */}


        {/* Pending Workouts Section (Unchanged) */}
        {pendingWorkouts.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>Resume Workout</Text>
            <FlatList
              data={pendingWorkouts}
              renderItem={({ item }) => (
                <WorkoutCard workout={item} onPress={() => onViewWorkout(item._id)} />
              )}
              keyExtractor={item => item._id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Completed Workouts Section (Unchanged) */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Workout History</Text>
          {completedWorkouts.length > 0 ? (
            <FlatList
              data={completedWorkouts}
              renderItem={({ item }) => (
                <WorkoutCard workout={item} onPress={() => onViewWorkout(item._id)} />
              )}
              keyExtractor={item => item._id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Card style={styles.placeholderCard}>
              <Card.Content>
                <Text variant="bodyMedium">You haven't completed any workouts yet.</Text>
              </Card.Content>
            </Card>
          )}
        </View>

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
    justifyContent: 'flex-start',
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
    paddingVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  // --- NEW STYLE ---
  card: {
    marginBottom: 24,
    marginHorizontal: 16,
  },
  // --- END NEW STYLE ---
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  workoutCard: {
    width: 250,
    marginRight: 12,
    marginLeft: 16,
  },
  placeholderCard: {
    marginHorizontal: 16,
  }
});

export default HomeScreen;