import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';
import { CircleCheckIcon, InfoIcon, WarningIcon } from '../Icons';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

interface StyledAlertProps {
  message: string;
  variant: 'error' | 'success' | 'warning' | 'info';
}

export default function StyledAlert({ message, variant }: StyledAlertProps) {
  const { theme } = useTheme();
  const { isMobile } = useResponsiveLayout();

  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          backgroundColor: 'rgba(255, 59, 48, 0.1)', // rojo con 10% de opacidad
          borderColor: theme.border.error,
          textColor: theme.text.error,
        };
      case 'success':
        return {
          backgroundColor: 'rgba(52, 199, 89, 0.1)', // verde con 10% de opacidad
          borderColor: theme.border.success,
          textColor: theme.text.success,
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(255, 149, 0, 0.1)', // naranja con 10% de opacidad
          borderColor: theme.border.warning,
          textColor: theme.text.warning,
        };
      case 'info':
        return {
          backgroundColor: 'rgba(0, 122, 255, 0.1)', // azul con 10% de opacidad
          borderColor: theme.border.info,
          textColor: theme.text.info,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const getIconVariant = () => {
    const size = isMobile ? 24 : 18;
    switch (variant) {
      case 'error':
        return <WarningIcon color={theme.text.error} size={size} />;
      case 'warning':
        return <WarningIcon color={theme.text.warning} size={size} />;
      case 'info':
        return <InfoIcon color={theme.text.info} size={size} />;
      case 'success':
        return <CircleCheckIcon color={theme.text.success} size={size} />;
    }
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          gap: isMobile ? 0 : 12,
        },
      ]}
    >
      {getIconVariant()}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
