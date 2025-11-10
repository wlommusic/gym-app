import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App'; // This is the App.js file, the main component
import {name as appName} from './app.json';

// --- NEW IMPORTS ---
// 1. We import the RealmProvider from our database library
import {RealmProvider} from '@realm/react';
// 2. We import the database config we created
import {realmConfig} from './src/realmConfig';
// --- END NEW IMPORTS ---

// --- NEW COMPONENT ---
// We've created a new "wrapper" component.
// Its only job is to wrap our <App> component with the <RealmProvider>.
const AppWrapper = () => (
  <RealmProvider {...realmConfig}>
    <App />
  </RealmProvider>
);
// --- END NEW COMPONENT ---

// Finally, we tell React Native to register our NEW AppWrapper component
// as the main app, instead of the original 'App' component.
AppRegistry.registerComponent(appName, () => AppWrapper);