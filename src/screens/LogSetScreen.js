import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text, Button } from 'react-native-paper';

// 1. We'll receive navigation and route
const LogSetScreen = ({ navigation, route }) => {

  // 2. We'll get the ID of the 'WorkoutExercise' we're logging
  const { workoutExerciseId } = route.params || {};

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        {/* TODO: The title should be the exercise name */}
        <Appbar.Content title="Log Sets" />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium">Log Set Screen</Text>

        <Text variant="bodySmall" style={{marginTop: 16}}>
          Logging for WorkoutExercise ID:
        </Text>
        <Text variant="bodySmall">{workoutExerciseId}</Text>

        {/* We'll build the form here later */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
});

export default LogSetScreen;