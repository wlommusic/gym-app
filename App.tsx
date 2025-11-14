import React from 'react';
import { StyleSheet } from 'react-native';
// 1. Import our NEW RootNavigator
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 2. Render the RootNavigator */}
      <RootNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;