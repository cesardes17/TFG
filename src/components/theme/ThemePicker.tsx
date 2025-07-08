// src/components/ThemeSwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemePreference, useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';

const options: { label: string; value: ThemePreference }[] = [
  { label: 'Sistema', value: 'system' },
  { label: 'Claro', value: 'light' },
  { label: 'Oscuro', value: 'dark' },
];

export default function ThemeSwitcher() {
  const { preference, setPreference, theme } = useTheme();

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, { color: theme.text.primary }]}>
        Elige Tema
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
                  backgroundColor: selected
                    ? theme.button.primary.background
                    : 'transparent',
                },
              ]}
              onPress={() => setPreference(opt.value)}
            >
              <StyledText
                style={{
                  color: selected ? theme.text.light : theme.text.primary,
                }}
              >
                {opt.label}
              </StyledText>
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

    borderRadius: 4,
    alignItems: 'center',
  },
});
