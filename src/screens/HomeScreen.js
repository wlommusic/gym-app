import React from 'react';
import { ScrollView, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
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

const WorkoutCard = ({ workout, onPress }) => {
  if (!workout || !workout.isValid()) return null;

  const getExerciseSummary = (workoutExercises) => {
    if (!workoutExercises || workoutExercises.length === 0) {
      return "No exercises";
    }
    const groups = workoutExercises.reduce((acc, we) => {
      if (we && we.isValid() && we.exercise && we.exercise.isValid()) {
        const muscle = we.exercise.primary_muscle_group || 'Other';
        acc[muscle] = (acc[muscle] || 0) + 1;
      }
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

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const completedWorkoutsThisWeek = useQuery(Workout, workouts => {
    return workouts.filtered("status == 'completed' AND date >= $0", startOfWeek);
  });

  const onQuickStart = () => {
    if (!user) {
      Alert.alert("Error", "No user profile found. Please restart the app.");
      return;
    }

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
        <View style={styles.buttonRow}>
          <Button
            icon="play-circle"
            mode="contained"
            onPress={onQuickStart}
            style={styles.button}>
            Quick start
          </Button>
          <Button
            icon="clipboard-list"
            mode="outlined"
            onPress={() => navigation.navigate('Templates')}
            style={styles.button}>
            Templates
          </Button>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Your Week" />
          <Card.Content>
            <Text variant="bodyMedium">🔥 0-Day Streak!</Text>
            <Text variant="bodyMedium">
              💪 {completedWorkoutsThisWeek.length} Workouts This Week
            </Text>
          </Card.Content>
        </Card>

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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  headerContent: {},
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: '#FFFFFF' },
  content: { paddingVertical: 16 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  button: { flex: 1, marginHorizontal: 4 },
  card: { marginBottom: 24, marginHorizontal: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { marginBottom: 12, paddingHorizontal: 16 },
  workoutCard: { width: 250, marginRight: 12, marginLeft: 16 },
  placeholderCard: { marginHorizontal: 16 }
});

export default HomeScreen;