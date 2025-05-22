import { router, Stack } from 'expo-router';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { ArrowBackIcon, ArrowBackIosIcon } from '../../src/components/Icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import StyledText from '../../src/components/common/StyledText';
import { useUser } from '../../src/contexts/UserContext';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { theme } = useTheme();
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return <LoadingIndicator text='Cargando...' />;
  }

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.background.navigation,
        },
        headerTitleStyle: {
          color: theme.text.light,
        },
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.replace('/');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
                gap: 5,
              }}
            >
              {Platform.OS === 'ios' ? (
                <ArrowBackIosIcon color={theme.text.light} />
              ) : (
                <ArrowBackIcon color={theme.text.light} />
              )}
              <StyledText style={{ color: theme.text.light }}>
                Inicio
              </StyledText>
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name='login' options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name='register' options={{ title: 'Crea una Cuenta' }} />
      <Stack.Screen name='editarPerfil' options={{ title: 'Editar Perfil' }} />
    </Stack>
  );
}
