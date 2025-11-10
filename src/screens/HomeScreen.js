import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Button,
  Card,
  Text,
  useTheme,
  IconButton, // <-- We've replaced Appbar with IconButton
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  // We still need the theme for colors
  const theme = useTheme();

  // Date logic is correct and stays inside
  const today = new Date();
  const formattedDate = today.toDateString();

  return (
    // We change the root SafeAreaView to apply the background color
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* 1. --- THIS IS OUR NEW CUSTOM HEADER --- */}
      <View
        style={styles.header}>
        {/* This View holds our text */}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hello, User</Text> // for later, replace with user's name
          <Text style={styles.headerSubtitle}>{formattedDate}</Text>
        </View>

        {/* We use an IconButton for the "cog" */}
        <IconButton
          icon="cog"
          iconColor="#FFFFFF" // Force the icon color to white
          onPress={() => { /* TODO: Open settings */ }}
        />
      </View>
      {/* --- END CUSTOM HEADER --- */}


      {/* ScrollView for the rest of the content */}
      <ScrollView style={styles.content}>

        {/* 2. Section A: Call to Action (Buttons) */}
        <View style={styles.buttonRow}>
          <Button
            icon="play-circle"
            mode="contained"
            onPress={() => { /* TODO: Start Quick Workout */ }}
            style={styles.button}>
            Quick Start
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
            {/* This is our "empty state" message for now */}
            <Text variant="bodyMedium">You haven't logged any workouts yet.</Text>
            <Text variant="bodyMedium">Tap "Quick Start" to begin!</Text>
          </Card.Content>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};

// This is where we define our styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- NEW HEADER STYLES ---
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#AD27F5',
  },
  headerContent: {
    // This View just holds the two text lines
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // Force white text
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF', // Force white text
  },
  // --- END NEW HEADER STYLES ---
  content: {
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1, // Make buttons share space
    marginHorizontal: 4,
  },
  card: {
    marginBottom: 16,
  },
});

export default HomeScreen;
