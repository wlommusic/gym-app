import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// --- NEW IMPORT ---
import { useTheme } from 'react-native-paper'; // 1. Import useTheme
// --- END NEW IMPORT ---

import HomeStack from './HomeStack';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // --- NEW HOOK ---
  // 2. Get the current theme
  const theme = useTheme();
  // --- END NEW HOOK ---

  return (
    <NavigationContainer>
      <Tab.Navigator
        // 3. We update screenOptions to apply theme colors
        screenOptions={{
          headerShown: false,

          // --- THIS IS THE FIX ---
          // Set the tab bar's background color
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
          },
          // Set the color for the active (selected) tab icon
          tabBarActiveTintColor: theme.colors.primary,
          // Set the color for inactive tabs
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          // --- END FIX ---
        }}>

        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Workouts"
          component={WorkoutsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Exercises"
          component={ExercisesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarLabel: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;