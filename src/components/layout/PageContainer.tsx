import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useResponsiveWidth } from '../../hooks/useResponsiveWidth';

interface PageContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, style }) => {
  const { theme, mode } = useTheme();
  const { containerWidth } = useResponsiveWidth();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background.primary }]}
    >
      <StatusBar
        barStyle={mode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background.primary}
        translucent
      />
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
          },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
});

export default PageContainer;
