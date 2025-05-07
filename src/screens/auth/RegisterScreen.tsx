import { useState } from 'react';
import RegisterForm from '../../components/forms/auth/RegisterForm';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function RegisterScreen() {
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

  return <RegisterForm setIsLoading={setIsLoading} />;
}
