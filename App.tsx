import React from 'react';
import { StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// 1. Import from 'react-native-safe-area-context' (not 'react-native')
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {
  return (
    // 2. Use SafeAreaView as the root component
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // This makes the Safe Area fill the whole screen
  },
});

export default App;