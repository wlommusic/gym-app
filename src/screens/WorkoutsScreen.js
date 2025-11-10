import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper'; // Import Text from Paper

// This is just a placeholder component for now
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">workouts Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;