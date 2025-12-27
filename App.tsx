import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RealmProvider } from '@realm/react';
import { realmConfig } from './src/realmConfig';

function App() {
  return (
    <SafeAreaProvider>
      <RealmProvider {...realmConfig}>
        <RootNavigator />
      </RealmProvider>
    </SafeAreaProvider>
  );
}

export default App;
