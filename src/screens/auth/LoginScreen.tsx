import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import LoginForm from '../../components/forms/auth/LoginForm';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size='large' color={theme.icon.active} />
      </View>
    );
  }

  return <LoginForm setIsLoading={setIsLoading} />;
}
