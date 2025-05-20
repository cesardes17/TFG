import { useState } from 'react';
import RegisterForm from '../../components/forms/auth/RegisterForm';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  if (isLoading) {
    return <LoadingIndicator text='Creando Cuenta...' />;
  }

  return <RegisterForm setIsLoading={setIsLoading} />;
}
