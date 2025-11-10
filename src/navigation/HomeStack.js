import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import the screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutLoggingScreen from '../screens/WorkoutLoggingScreen';
import SelectExerciseScreen from '../screens/SelectExerciseScreen';
// --- NEW IMPORT ---
import LogSetScreen from '../screens/LogSetScreen';
// --- END NEW IMPORT ---

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="WorkoutLogging" component={WorkoutLoggingScreen} />
      <Stack.Screen name="SelectExercise" component={SelectExerciseScreen} />

      {/* --- ADD THIS NEW SCREEN --- */}
      <Stack.Screen name="LogSet" component={LogSetScreen} />
      {/* --- END ADDITION --- */}

    </Stack.Navigator>
  );
};

export default HomeStack;