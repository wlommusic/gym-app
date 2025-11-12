import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {RealmProvider} from '@realm/react';
import {realmConfig} from './src/realmConfig';
import {PaperProvider}from 'react-native-paper';

const AppWrapper = () => (
  <RealmProvider {...realmConfig}>
    <PaperProvider>
      <App />
    </PaperProvider>
  </RealmProvider>
);

AppRegistry.registerComponent(appName, () => AppWrapper);