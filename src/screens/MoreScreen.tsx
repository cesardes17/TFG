// src/screens/MoreScreen.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { navigationItems } from '../constants/navigationsItems';
import { useUser } from '../contexts/UserContext';
import NavigationCard from '../components/navigation/NavigationCard';
import { useVerificarAnunciosNuevos } from '../hooks/useVerificarAnunciosNuevos';
import { useVerificarSolicitudes } from '../hooks/useVerificarSolicitudes';

export default function MoreScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useUser();

  const nAnuncios = useVerificarAnunciosNuevos();
  const nSolicitudes = useVerificarSolicitudes();

  const userRol = user ? user.rol : null;

  const filteredItems = navigationItems.filter(
    (item) =>
      item.allowedRoles.includes('*') ||
      (item.allowedRoles.includes('auth') && user) ||
      (userRol && item.allowedRoles.includes(userRol))
  );

  const getBadgeCount = (itemId: string) => {
    if (itemId === 'solicitudes') return nSolicitudes;
    if (itemId === 'tablonAnuncios') return nAnuncios;
    return 0;
  };

  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NavigationCard
          onPress={() => router.push(item.path)}
          item={item}
          badgeCount={item.showBadge ? getBadgeCount(item.id) : 0}
        />
      )}
    />
  );
}
