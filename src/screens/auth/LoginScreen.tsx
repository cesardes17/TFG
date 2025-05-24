import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import LoginForm from '../../components/forms/auth/LoginForm';
import LoadingIndicator from '../../components/common/LoadingIndicator';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  if (isLoading) {
    return <LoadingIndicator text='Iniciando Sesión...' />;
  }

  return <LoginForm />;
}
