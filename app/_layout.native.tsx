// app/_layout.native.tsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function NativeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196f3',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='home' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='cog' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
