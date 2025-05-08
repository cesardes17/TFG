// src/screens/MoreScreen.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { navigationItems } from '../constants/navigationsItems';
import { useUser } from '../contexts/UserContext';
import NavigationCard from '../components/navigation/NavigationCard';

export default function MoreScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useUser();

  const userRol = user ? user.role : null;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
  },
});
