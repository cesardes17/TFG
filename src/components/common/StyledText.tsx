// src/components/StyledText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export type TextVariant = keyof ReturnType<typeof useTheme>['theme']['text'];
export type TextSize = 'small' | 'medium' | 'large' | number;

interface StyledTextProps extends TextProps {
  variant?: TextVariant; // 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
  size?: TextSize; // 'small' | 'medium' | 'large' or numeric
}

export default function StyledText({
  variant = 'primary',
  size = 'medium',
  style,
  children,
  ...rest
}: StyledTextProps) {
  const { theme } = useTheme();
  // Determine color from theme.text
  const color = theme.text[variant] || theme.text.primary;
  // Determine font size
  const fontSize =
    typeof size === 'number'
      ? size
      : size === 'small'
      ? 12
      : size === 'large'
      ? 20
      : 16; // medium

  const textStyle: TextStyle = {
    color,
    fontSize,
  };

  return (
    <Text style={[styles.default, textStyle, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    includeFontPadding: false,
    textAlignVertical: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});
