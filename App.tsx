/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { TimerProvider } from './src/timercomp/TimerContext';
import { SafeAreaView } from 'react-native-safe-area-context';

function AppContent() {
  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <TimerProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </TimerProvider>
  );
}
