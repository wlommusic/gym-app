import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import our new placeholder screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ProgressScreen from '../screens/ProgressScreen';

// 1. This creates the "Tab" object
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    // 2. This container is required to wrap all navigation
    <NavigationContainer>
      {/* 3. This is the Tab Bar component itself */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // We'll add custom headers later
        }}>
        {/* 4. This is our first tab */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        {/* 5. This is our second tab */}
        <Tab.Screen
          name="Workouts"
          component={WorkoutsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
            ),
          }}
        />
        {/* 6. This is our third tab */}
        <Tab.Screen
          name="Exercises"
          component={ExercisesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
            ),
          }}
        />
        {/* 7. This is our fourth tab */}
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