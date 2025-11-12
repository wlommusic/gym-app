import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4FC3F7',     // A bright, light blue
    onPrimary: '#00334A',   // Text/icons *on* the primary color (dark blue)
    primaryContainer: '#004A6A',
    onPrimaryContainer: '#B8EAFC',

    background: '#1B1C1E', // Very dark, slightly cool gray
    surface: '#292B2E',    // Color for cards and the tab bar
    onSurface: '#E3E2E6',  // Main text color (light gray)
    onSurfaceVariant: '#C4C6CB', // Secondary text/icons (medium gray)
  },
};