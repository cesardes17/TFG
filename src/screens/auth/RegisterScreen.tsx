// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import RegisterForm from '../../components/forms/auth/RegisterForm';
import { useUser } from '../../contexts/UserContext';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  return isLoading || loadingUser ? (
    <LoadingIndicator text='Creando cuenta...' />
  ) : (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <RegisterForm setIsLoading={setIsLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
