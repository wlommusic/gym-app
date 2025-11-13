import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

// --- IMPORTS HAVE CHANGED ---
import HomeStack from './HomeStack';
// We NO LONGER import WorkoutsScreen
// import WorkoutsScreen from '../screens/WorkoutsScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ProgressScreen from '../screens/ProgressScreen';
// 1. Import our new ProfileScreen
import ProfileScreen from '../screens/ProfileScreen';
// --- END IMPORTS ---

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        }}>

        {/* Tab 1: Home (Unchanged) */}
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

        {/* Tab 2: Exercises (Unchanged) */}
        <Tab.Screen
          name="Exercises"
          component={ExercisesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
            ),
          }}
        />

        {/* Tab 3: Progress (Unchanged) */}
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

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;