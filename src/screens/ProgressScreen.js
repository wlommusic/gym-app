import React from 'react';
import { View, StyleSheet } from 'react-native';
// 1. Import useTheme and Appbar
import { Appbar, Text, useTheme } from 'react-native-paper';

const ProgressScreen = () => {
  // 2. Get the theme
  const theme = useTheme();

  return (
    // 3. Apply the theme's background color
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Progress & Analytics" />
      </Appbar.Header>

      {/* 4. Update the placeholder content */}
      <View style={styles.content}>
        <Text variant="headlineMedium">Progress Screen</Text>
        <Text variant="bodyLarge" style={{textAlign: 'center', marginTop: 8}}>
          Graphs and stats will go here.
        </Text>
      </View>
    </View>
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

export default ProgressScreen;