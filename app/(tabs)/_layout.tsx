// app/_layout.native.tsx   ← Tabs (iOS/Android)
import React from 'react';
import { Tabs } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';

// Simula el estado de autenticación (cámbialo a `true` para ver Perfil)
const isLoggedIn = false;

export default function NativeLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.icon.active,
        tabBarInactiveTintColor: theme.icon.inactive,
        tabBarStyle: { backgroundColor: theme.background },
        tabBarLabelStyle: { fontSize: 12 },
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.text.primary },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='home' size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='perfil'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='more'
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <Feather name='menu' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
