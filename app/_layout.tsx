// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { UserProvider } from '../src/contexts/UserContext';
import { TemporadaProvider } from '../src/contexts/TemporadaContext';

export default function RootLayout() {
  return (
    <TemporadaProvider>
      <UserProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </UserProvider>
    </TemporadaProvider>
  );
}
