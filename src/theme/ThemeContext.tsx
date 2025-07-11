import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const LIGHT = {
  mode: 'light',
  background: '#F6F8FA',
  card: '#FFFFFF',
  text: '#22223B',
  accent: '#4F8EF7',
  border: '#E2E8F0',
  muted: '#6B7280',
  chip: '#E0E7FF',
  chipSelected: '#4F8EF7',
};
const DARK = {
  mode: 'dark',
  background: '#181A1B',
  card: '#23272F',
  text: '#F3F4F6',
  accent: '#4F8EF7',
  border: '#2D3748',
  muted: '#A0AEC0',
  chip: '#23272F',
  chipSelected: '#4F8EF7',
};

type ThemeType = typeof LIGHT;

export const ThemeContext = createContext<{
  theme: ThemeType;
  toggleTheme: () => void;
}>({
  theme: LIGHT,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(LIGHT);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'dark') setTheme(DARK);
      else if (saved === 'light') setTheme(LIGHT);
      else setTheme(Appearance.getColorScheme() === 'dark' ? DARK : LIGHT);
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme.mode === 'light' ? DARK : LIGHT;
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme.mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {children}
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}
