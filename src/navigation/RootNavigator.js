import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useQuery } from '@realm/react';
import { User } from '../models';

// Import our two main app "states"
import LoginScreen from '../screens/LoginScreen';
import AppNavigator from './AppNavigator';
import { ActivityIndicator } from 'react-native-paper'; // For a loading screen

const Stack = createStackNavigator();

const RootNavigator = () => {
  // 1. Query the database for a User.
  //    This is a "live" query.
  const users = useQuery(User);

  // 2. Check if a user exists.
  //    We'll assume for now only one user ever exists.
  const isLoggedIn = users.length > 0;

  // 3. This is a loading state. 'useQuery' can take a
  //    split second to run. We show a spinner.
  if (users === null) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  return (
    // 4. The NavigationContainer now lives here
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* 5. This is the logic.
             IF isLoggedIn is 'true', the app will show 'Main'.
             IF isLoggedIn is 'false', the app will show 'Login'.
             When the user saves, 'isLoggedIn' becomes 'true'
             and the app will automatically switch.
        */}
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;