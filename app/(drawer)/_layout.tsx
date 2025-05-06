// app/_layout.web.tsx     ← Drawer (web)
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

// Simula el estado de autenticación (cámbialo a `true` para ver Perfil)
const isLoggedIn = false;

export default function WebLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ headerShown: true }}>
        <Drawer.Screen name='index' options={{ drawerLabel: 'Home' }} />

        <Drawer.Screen name='perfil' options={{ drawerLabel: 'Perfil' }} />
        <Drawer.Screen name='ajustes' options={{ drawerLabel: 'Ajustes' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
