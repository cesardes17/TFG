import { router, Stack } from 'expo-router';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { ArrowBackIcon, ArrowBackIosIcon } from '../../src/components/Icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import StyledText from '../../src/components/common/StyledText';

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.background.navigation,
        },
        headerTitleStyle: {
          color: theme.text.primary,
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
                <ArrowBackIosIcon color={theme.text.primary} />
              ) : (
                <ArrowBackIcon color={theme.text.primary} />
              )}
              <StyledText>Inicio</StyledText>
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name='login' options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name='register' options={{ title: 'Crea una Cuenta' }} />
    </Stack>
  );
}
