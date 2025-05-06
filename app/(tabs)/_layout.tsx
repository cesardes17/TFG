// app/_layout.native.tsx   ← Tabs (iOS/Android)
import React from 'react';
import { Tabs } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';

// Simula el estado de autenticación (cámbialo a `true` para ver Perfil)
const isLoggedIn = false;

export default function NativeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196f3',
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
