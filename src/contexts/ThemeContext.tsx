// src/context/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../theme/theme';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darktTheme';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  theme: Theme;
}

const STORAGE_KEY = 'themePreference';

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  preference: 'system',
  setPreference: () => {},
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [preference, setPref] = useState<ThemePreference>('system');
  const [mode, setMode] = useState<ThemeMode>(
    systemScheme === 'dark' ? 'dark' : 'light'
  );

  // Cargar preferencia guardada
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'light' || value === 'dark' || value === 'system') {
        setPref(value);
      }
    });
  }, []);

  // Calcular modo efectivo al cambiar preferencia o esquema del sistema
  useEffect(() => {
    let next: ThemeMode = 'light';
    if (preference === 'system') {
      next = systemScheme === 'dark' ? 'dark' : 'light';
    } else {
      next = preference;
    }
    setMode(next);
  }, [preference, systemScheme]);

  const setPreference = (pref: ThemePreference) => {
    setPref(pref);
    AsyncStorage.setItem(STORAGE_KEY, pref).catch(() => {
      /* opcional: log de error */
    });
  };

  // Seleccionar el tema correspondiente
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, preference, setPreference, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
