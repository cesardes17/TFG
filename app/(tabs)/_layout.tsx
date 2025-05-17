// app/_layout.native.tsx   ← Tabs (iOS/Android)
import React, { useCallback, useState } from 'react';
import { Tabs, useFocusEffect } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useUser } from '../../src/contexts/UserContext';
import {
  HomeIcon,
  LogInIcon,
  MenuIcon,
  UserCircleIcon,
} from '../../src/components/Icons';
import { useVerificarAnunciosNuevos } from '../../src/hooks/useVerificarAnunciosNuevos';

export default function NativeLayout() {
  const { theme } = useTheme();
  const { user, loadingUser } = useUser();

  const showMoreBadge = useVerificarAnunciosNuevos();

  console.log('anunciosNuevos: ', showMoreBadge);

  if (loadingUser) return null;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.icon.active,
        tabBarInactiveTintColor: theme.icon.inactive,
        tabBarStyle: { backgroundColor: theme.background.navigation },
        tabBarLabelStyle: { fontSize: 12 },
        headerStyle: { backgroundColor: theme.background.navigation },
        headerTitleStyle: { color: theme.text.light },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='perfil-helper'
        options={{
          title: user ? 'Perfil' : 'Iniciar Sesión',
          tabBarIcon: ({ color, size }) =>
            user ? (
              <UserCircleIcon size={size} color={color} />
            ) : (
              <LogInIcon size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='more'
        options={{
          title: 'More',
          tabBarBadge: showMoreBadge ? '' : undefined,
          tabBarIcon: ({ color, size }) => (
            <MenuIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
