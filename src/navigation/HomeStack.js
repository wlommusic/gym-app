import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import WorkoutLoggingScreen from '../screens/WorkoutLoggingScreen';
import SelectExerciseScreen from '../screens/SelectExerciseScreen';
import LogSetScreen from '../screens/LogSetScreen';
import CreateExerciseScreen from '../screens/CreateExerciseScreen';
import SelectBodyPartScreen from '../screens/SelectBodyPartScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import CreateWorkoutSplitScreen from '../screens/CreateWorkoutSplitScreen';
import AddExerciseToSplitScreen from '../screens/AddExerciseToSplitScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Main Dashboard */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* 2. Workout Execution Flow */}
      <Stack.Screen name="SelectBodyPart" component={SelectBodyPartScreen} />
      <Stack.Screen name="WorkoutLogging" component={WorkoutLoggingScreen} />
      <Stack.Screen name="SelectExercise" component={SelectExerciseScreen} />
      <Stack.Screen name="LogSet" component={LogSetScreen} />
      <Stack.Screen name="CreateExercise" component={CreateExerciseScreen} />

      {/* 3. Templates & Custom Split Flow */}
      <Stack.Screen name="Templates" component={TemplatesScreen} />

      {/* UPDATED NAMES to match your screen code: */}
      <Stack.Screen
        name="CreateWorkoutSplitScreen"
        component={CreateWorkoutSplitScreen}
      />
      <Stack.Screen
        name="AddExerciseToSplitScreen"
        component={AddExerciseToSplitScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;