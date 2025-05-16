import React, { ReactNode } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';

interface LoadingIndicatorProps {
  children?: ReactNode;
  text?: string;
}

export default function LoadingIndicator({
  children,
  text,
}: LoadingIndicatorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={theme.text.primary} />
      {(children || text) && (
        <StyledText variant='secondary' style={styles.text}>
          {children || text}
        </StyledText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
  },
});
