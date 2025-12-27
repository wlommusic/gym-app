import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useQuery } from '@realm/react';
import { User } from '../models';
import { ActivityIndicator } from 'react-native-paper';

// Import our two main app "states"
import LoginScreen from '../screens/LoginScreen';
import AppNavigator from './AppNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const users = useQuery(User);

  // Loading state while Realm initializes
  if (!users) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  const isLoggedIn = users.length > 0;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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