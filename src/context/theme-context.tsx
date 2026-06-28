import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { appThemes, type AppTheme, type AppThemeMode } from '@/constants/theme';

const STORAGE_KEY = 'portfolio-theme-mode';

type ThemeContextValue = {
  mode: AppThemeMode;
  theme: AppTheme;
  isDark: boolean;
  setThemeMode: (mode: AppThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppThemeMode>('light');

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((storedMode) => {
        if (mounted && (storedMode === 'light' || storedMode === 'dark')) {
          setMode(storedMode);
        }
      })
      .catch(() => {
        // Keep the exact existing light mode if storage is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setThemeMode = useCallback((nextMode: AppThemeMode) => {
    setMode(nextMode);
    AsyncStorage.setItem(STORAGE_KEY, nextMode).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setThemeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme: appThemes[mode],
      isDark: mode === 'dark',
      setThemeMode,
      toggleTheme,
    }),
    [mode, setThemeMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={value.isDark ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }

  return context;
}
