// app/_layout.web.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function WebLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ headerShown: true }}>
        <Drawer.Screen name='index' options={{ drawerLabel: 'Home' }} />
        <Drawer.Screen name='profile' options={{ drawerLabel: 'Perfil' }} />
        <Drawer.Screen name='settings' options={{ drawerLabel: 'Ajustes' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
