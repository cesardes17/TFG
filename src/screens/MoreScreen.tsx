// src/screens/MoreScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { navigationItems } from '../constants/navigationsItems';
import { useUser } from '../contexts/UserContext';
import NavigationCard from '../components/navigation/NavigationCard';
import { useVerificarAnunciosNuevos } from '../hooks/useVerificarAnunciosNuevos';
import { useVerificarSolicitudes } from '../hooks/useVerificarSolicitudes';

export default function MoreScreen() {
  const router = useRouter();
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
    <View style={{ gap: 12, padding: 8 }}>
      {filteredItems.map((item) => (
        <NavigationCard
          key={item.id}
          onPress={() => router.push(item.path)}
          item={item}
          badgeCount={item.showBadge ? getBadgeCount(item.id) : 0}
        />
      ))}
    </View>
  );
}
