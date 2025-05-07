// src/screens/MoreScreen.tsx
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function MoreScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // Opciones de navegación adicionales
  const options = [{ label: 'Settings', route: '/settings' }];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text.primary }]}>
        More Options
      </Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.route}
          style={[styles.button, { borderColor: theme.border.secondary }]}
          onPress={() => router.push(opt.route)}
        >
          <Text style={[styles.buttonText, { color: theme.text.secondary }]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
