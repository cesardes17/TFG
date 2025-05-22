// app/_layout.web.tsx     ← Drawer (web)
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useUser } from '../../src/contexts/UserContext';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function WebLayout() {
  const { theme } = useTheme();
  const { user, loadingUser } = useUser();

  if (loadingUser) return null;

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
          options={{
            drawerLabel: user ? 'Perfil' : 'Login',
            title: 'Perfil',
          }}
        />
        <Drawer.Screen
          name='panelControl'
          options={{
            drawerLabel: 'Panel de Control',
            title: 'Panel de Control',
            drawerItemStyle: {
              display:
                user?.rol === 'organizador' || user?.rol === 'coorganizador'
                  ? 'flex'
                  : 'none',
            },
          }}
        />
        <Drawer.Screen
          name='administrarUsuarios'
          options={{
            drawerLabel: 'Administrar Usuarios',
            title: 'Administrar Usuarios',
            drawerItemStyle: {
              display:
                user?.rol === 'organizador' || user?.rol === 'coorganizador'
                  ? 'flex'
                  : 'none',
            },
          }}
        />
        <Drawer.Screen
          name='solicitudes'
          options={{
            drawerLabel: 'Solicitudes',
            title: 'Solicitudes',
            drawerItemStyle: {
              display:
                user?.rol !== 'espectador' && user?.rol !== 'arbitro'
                  ? 'flex'
                  : 'none',
            },
          }}
        />
        <Drawer.Screen
          name='bolsaJugadores'
          options={{
            drawerLabel: 'Bolsa de Jugadores',
            title: 'Bolsa de Jugadores',
            drawerItemStyle: {
              display:
                user?.rol !== 'espectador' &&
                user?.rol !== 'arbitro' &&
                user?.rol !== 'jugador'
                  ? 'flex'
                  : 'none',
            },
          }}
        />
        <Drawer.Screen
          name='tablonAnuncios'
          options={{
            drawerLabel: 'Tablon de Anuncios',
            title: 'Tablon de Anuncios',
          }}
        />

        <Drawer.Screen name='ajustes' options={{ drawerLabel: 'Ajustes' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
