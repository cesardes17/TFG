// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { UserProvider } from '../src/contexts/UserContext';
import { TemporadaProvider } from '../src/contexts/TemporadaContext';
import { ToastProvider } from '../src/contexts/ToastContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <TemporadaProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ToastProvider>
        </TemporadaProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
