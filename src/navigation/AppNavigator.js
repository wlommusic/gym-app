import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Import our new stack ---
import HomeStack from './HomeStack';

// --- Import the other main screens ---
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        // This hides the default header for ALL tabs
        screenOptions={{
          headerShown: false,
        }}>

        {/* The "Home" tab now renders the ENTIRE HomeStack */}
        <Tab.Screen
          name="HomeStack" // Renamed the route
          component={HomeStack}
          options={{
            tabBarLabel: 'Home', // This keeps the text on the tab correct
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />

        {/* Other tabs are unchanged */}
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