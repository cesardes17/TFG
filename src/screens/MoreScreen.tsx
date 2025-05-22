// src/screens/MoreScreen.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { navigationItems } from '../constants/navigationsItems';
import { useUser } from '../contexts/UserContext';
import NavigationCard from '../components/navigation/NavigationCard';

export default function MoreScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useUser();

  const userRol = user ? user.rol : null;

  const filteredItems = navigationItems.filter(
    (item) =>
      item.allowedRoles.includes('*') ||
      (item.allowedRoles.includes('auth') && user) ||
      (userRol && item.allowedRoles.includes(userRol))
  );

  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NavigationCard
          onPress={() => {
            router.push(item.path);
          }}
          item={item}
        />
      )}
    />
  );
}
