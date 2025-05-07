import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';

interface StyledAlertProps {
  message: string;
  variant: 'error' | 'success' | 'warning' | 'info';
}

export default function StyledAlert({ message, variant }: StyledAlertProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          backgroundColor: theme.background.error,
          borderColor: theme.border.error,
          textColor: theme.text.error,
        };
      case 'success':
        return {
          backgroundColor: theme.background.success,
          borderColor: theme.border.success,
          textColor: theme.text.success,
        };
      case 'warning':
        return {
          backgroundColor: theme.background.warning,
          borderColor: theme.border.warning,
          textColor: theme.text.warning,
        };
      case 'info':
        return {
          backgroundColor: theme.background.info,
          borderColor: theme.border.info,
          textColor: theme.text.info,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
        },
      ]}
    >
      <StyledText style={[styles.text, { color: variantStyles.textColor }]}>
        {message}
      </StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
