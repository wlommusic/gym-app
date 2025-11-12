import 'react-native-get-random-values'; // <-- Line 1
import 'react-native-gesture-handler';   // <-- Line 2
import React from 'react';
import { AppRegistry, useColorScheme } from 'react-native'; // 1. Import useColorScheme
import App from './App';
import { name as appName } from './app.json';

import { RealmProvider } from '@realm/react';
import { realmConfig } from './src/realmConfig';
import { PaperProvider } from 'react-native-paper';

// --- NEW IMPORTS ---
// 2. Import our two new theme files
import { lightTheme } from './src/theme/lightTheme';
import { darkTheme } from './src/theme/darkTheme';
// --- END NEW IMPORTS ---

// --- MODIFIED WRAPPER ---
// 3. We've converted AppWrapper from a simple const
//    to a full component function.
const AppWrapper = () => {

  // 4. This hook checks the phone's system setting ('dark', 'light', or 'null')
  const colorScheme = useColorScheme();

  // 5. We select our theme. If 'colorScheme' is 'dark',
  //    use darkTheme, otherwise use lightTheme.
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <RealmProvider {...realmConfig}>
      {/* 6. We pass our selected 'theme' to the PaperProvider */}
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </RealmProvider>
  );
};
// --- END MODIFIED WRAPPER ---

AppRegistry.registerComponent(appName, () => AppWrapper);