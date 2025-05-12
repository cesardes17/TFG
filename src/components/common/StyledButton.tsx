import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';

interface StyledButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'outline' | 'error';
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function StyledButton({
  onPress,
  title,
  variant = 'primary',
  fullWidth = true,
  disabled = false,
}: StyledButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    if (disabled) return theme.button.disabled;
    return theme.button[variant] || theme.button.primary;
  };

  const buttonStyle = getButtonStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonStyle.background,
          borderColor: buttonStyle.border,
          borderWidth: variant === 'outline' ? 2 : 0,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <StyledText style={[styles.buttonText, { color: buttonStyle.text }]}>
        {title}
      </StyledText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
