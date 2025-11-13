import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import all the screens for this stack
import HomeScreen from '../screens/HomeScreen';
import WorkoutLoggingScreen from '../screens/WorkoutLoggingScreen';
import SelectExerciseScreen from '../screens/SelectExerciseScreen';
import LogSetScreen from '../screens/LogSetScreen';
import CreateExerciseScreen from '../screens/CreateExerciseScreen';

// --- 1. IMPORT THE NEW SCREEN ---
import SelectBodyPartScreen from '../screens/SelectBodyPartScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="SelectBodyPart" component={SelectBodyPartScreen} />

      <Stack.Screen name="WorkoutLogging" component={WorkoutLoggingScreen} />
      <Stack.Screen name="SelectExercise" component={SelectExerciseScreen} />
      <Stack.Screen name="LogSet" component={LogSetScreen} />
      <Stack.Screen name="CreateExercise" component={CreateExerciseScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;