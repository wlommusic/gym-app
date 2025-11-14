import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text, Button, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm } from '@realm/react';
import { User } from '../models';

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const realm = useRealm();
  const [name, setName] = useState('');

  const onSaveUser = () => {
    if (!name) {
      alert('Please enter your name.');
      return;
    }

    // Save the new user to the database
    realm.write(() => {
      realm.create('User', {
        name: name,
      });
    });

    // We don't need to navigate. The RootNavigator
    // will automatically detect the new user and switch screens.
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Welcome to GymTracker" />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium">Let's get started</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Please enter your name to continue.
        </Text>

        <TextInput
          label="Your Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={onSaveUser}
          style={styles.button}>
          Save and Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    padding: 8,
  },
});

export default LoginScreen;