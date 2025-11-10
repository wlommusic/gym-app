import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// --- NEW IMPORTS ---
import {RealmProvider} from '@realm/react';
import {realmConfig} from './src/realmConfig';
import {PaperProvider} from 'react-native-paper'; // 1. Import PaperProvider

// --- MODIFIED WRAPPER ---
// 2. We wrap our app in the PaperProvider, right inside the RealmProvider.
// The order matters: PaperProvider can go inside or outside, but
// let's keep it clean like this.
const AppWrapper = () => (
  <RealmProvider {...realmConfig}>
    <PaperProvider>
      <App />
    </PaperProvider>
  </RealmProvider>
);
// --- END MODIFIED WRAPPER ---

AppRegistry.registerComponent(appName, () => AppWrapper);