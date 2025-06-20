import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useResponsiveWidth } from '../../hooks/useResponsiveWidth';

interface PageContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  centrar?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, style }) => {
  const { theme, mode } = useTheme();
  const { containerWidth } = useResponsiveWidth();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background.primary }]}
    >
      <StatusBar
        barStyle='light-content'
        backgroundColor={theme.background.primary}
        translucent
      />
      <ScrollView
        style={[styles.container, style]}
        contentContainerStyle={{ width: containerWidth }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default PageContainer;
