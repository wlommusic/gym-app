import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Profile & Settings" />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium">Profile Screen</Text>
        <Text variant="bodyLarge" style={{textAlign: 'center', marginTop: 8}}>
          User settings (kg/lbs, theme, etc.) will go here.
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default ProfileScreen;