import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onHide: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onHide,
}: ToastProps) {
  const { theme } = useTheme();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, []);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.toast.success.background,
          textColor: theme.toast.success.text,
        };
      case 'error':
        return {
          backgroundColor: theme.toast.error.background,
          textColor: theme.toast.error.text,
        };
      case 'warning':
        return {
          backgroundColor: theme.toast.warning.background,
          textColor: theme.toast.warning.text,
        };
      case 'info':
      default:
        return {
          backgroundColor: theme.toast.info.background,
          textColor: theme.toast.info.text,
        };
    }
  };

  const toastStyle = getToastStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: toastStyle.backgroundColor,
          opacity,
        },
      ]}
    >
      <StyledText style={[styles.text, { color: toastStyle.textColor }]}>
        {message}
      </StyledText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Cambiado de bottom: 50 a top: 50
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});
