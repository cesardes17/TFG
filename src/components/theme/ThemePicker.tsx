// src/components/ThemeSwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemePreference, useTheme } from '../../contexts/ThemeContext';

const options: { label: string; value: ThemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function ThemeSwitcher() {
  const { preference, setPreference, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text.primary }]}>
        Choose Theme
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((opt) => {
          const selected = preference === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionButton,
                {
                  borderColor: selected
                    ? theme.text.primary
                    : theme.border.secondary,
                },
                {
                  backgroundColor: selected
                    ? theme.text.primary
                    : 'transparent',
                },
              ]}
              onPress={() => setPreference(opt.value)}
            >
              <Text
                style={{
                  color: selected ? theme.background : theme.text.primary,
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
});
