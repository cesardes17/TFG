import { router, Stack } from 'expo-router';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { ArrowBackIcon, ArrowBackIosIcon } from '../../src/components/Icons';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
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
                <ArrowBackIosIcon color='black' />
              ) : (
                <ArrowBackIcon color='black' />
              )}
              <Text>Inicio</Text>
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name='login' options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name='register' options={{ title: 'Registrarse' }} />
    </Stack>
  );
}
