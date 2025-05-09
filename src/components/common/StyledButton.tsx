import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';

interface StyledButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'outline' | 'error';
  fullWidth?: boolean;
}

export default function StyledButton({
  onPress,
  title,
  variant = 'primary',
  fullWidth = true,
}: StyledButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'error':
        return {
          backgroundColor: theme.text.error,
          borderColor: theme.text.error,
          textColor: theme.text.light,
        };
      case 'outline':
        return {
          backgroundColor: theme.transparent,
          borderColor: theme.border.primary,
          textColor: theme.text.light,
        };
      default:
        return {
          backgroundColor: theme.background.primary,
          borderColor: theme.border.primary,
          textColor: theme.text.light,
        };
    }
  };

  const buttonStyle = getButtonStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonStyle.backgroundColor,
          borderColor: buttonStyle.borderColor,
          borderWidth: variant === 'outline' ? 2 : 0,
          width: fullWidth ? '100%' : 'auto',
        },
      ]}
      onPress={onPress}
    >
      <StyledText style={[styles.buttonText, { color: buttonStyle.textColor }]}>
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
