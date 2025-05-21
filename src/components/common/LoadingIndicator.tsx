import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';

type LoadingIndicatorProps = {
  text?: string;
};

export default function LoadingIndicator({
  text = 'Procesando...',
}: LoadingIndicatorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={theme.text.primary} />
      <StyledText style={[styles.text, { color: theme.text.primary }]}>
        {text}
      </StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
});
