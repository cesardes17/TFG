// app/_layout.web.tsx     ← Drawer (web)
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useUser } from '../../src/contexts/UserContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useVerificarAnunciosNuevos } from '../../src/hooks/useVerificarAnunciosNuevos';
import { useVerificarSolicitudes } from '../../src/hooks/useVerificarSolicitudes';
import { DrawerLabelWithBadge } from '../../src/components/drawer/DrawerLabelWithBadge';

export default function WebLayout() {
  const { theme } = useTheme();
  const { user, loadingUser } = useUser();
  console.log('user - ', user);
  const nAnunciosNuevos = useVerificarAnunciosNuevos();
  const nSolicitudesNuevas = useVerificarSolicitudes();

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
        <Drawer.Screen
          name='index'
          options={{
            drawerLabel: () => <DrawerLabelWithBadge label={'Inicio'} />,
            title: 'Inicio',
          }}
        />
        <Drawer.Screen
          name='clasificacion'
          options={{
            drawerLabel: () => <DrawerLabelWithBadge label={'Clasificación'} />,
            title: 'Clasificación',
          }}
        />
        <Drawer.Screen
          name='jornadas'
          options={{
            drawerLabel: () => <DrawerLabelWithBadge label={'Jornadas'} />,
            title: 'Jornadas',
          }}
        />
        <Drawer.Screen
          name='perfil-helper'
          options={{
            drawerLabel: () => (
              <DrawerLabelWithBadge label={user ? 'Perfil' : 'Login'} />
            ),
            title: 'Perfil',
          }}
        />
        <Drawer.Screen
          name='panelControl'
          options={{
            drawerLabel: () => (
              <DrawerLabelWithBadge label='Panel de Control' />
            ),
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
            drawerLabel: () => (
              <DrawerLabelWithBadge label='Administrar Usuarios' />
            ),
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
            drawerLabel: () => (
              <DrawerLabelWithBadge
                label='Solicitudes'
                badgeCount={nSolicitudesNuevas}
              />
            ),
            title: 'Solicitudes',
            drawerItemStyle: {
              display:
                user && user?.rol !== 'espectador' && user?.rol !== 'arbitro'
                  ? 'flex'
                  : 'none',
            },
          }}
        />
        <Drawer.Screen
          name='bolsaJugadores'
          options={{
            drawerLabel: () => (
              <DrawerLabelWithBadge label='Bolsa de Jugadores' />
            ),
            title: 'Bolsa de Jugadores',
            drawerItemStyle: {
              display:
                user &&
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
            drawerLabel: () => (
              <DrawerLabelWithBadge
                label='Anuncios'
                badgeCount={nAnunciosNuevos}
              />
            ),
            title: 'Tablon de Anuncios',
          }}
        />

        <Drawer.Screen name='ajustes' options={{ drawerLabel: 'Ajustes' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
