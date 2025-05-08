// app/_layout.web.tsx     ← Drawer (web)
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useUser } from '../../src/contexts/UserContext';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function WebLayout() {
  const { theme } = useTheme();
  const { user, loading } = useUser();

  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background.navigation,
          },
          headerTintColor: theme.text.primary,
          drawerStyle: {
            backgroundColor: theme.background.navigation,
          },
          drawerLabelStyle: {
            color: theme.text.primary,
          },
          drawerActiveTintColor: theme.icon.active,
          headerTitleAlign: 'center',
        }}
      >
        <Drawer.Screen name='index' options={{ drawerLabel: 'Home' }} />

        <Drawer.Screen
          name='perfil-helper'
          options={{ drawerLabel: user ? 'Perfil' : 'Login' }}
        />
        <Drawer.Screen
          name='panelControl'
          options={{
            drawerLabel: 'Panel de Control',
            drawerItemStyle: {
              display:
                user?.role === 'organizador' || user?.role === 'coorganizador'
                  ? 'flex'
                  : 'none',
            },
          }}
        />

        <Drawer.Screen name='ajustes' options={{ drawerLabel: 'Ajustes' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
