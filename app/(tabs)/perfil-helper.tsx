// app/(tabs)/perfil-helper.tsx
import { Redirect, router, useFocusEffect } from 'expo-router';
import { useUser } from '../../src/contexts/UserContext';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';
import PerfilScreen from '../../src/screens/user/PerfilScreen';
import PageContainer from '../../src/components/layout/PageContainer';
import { useCallback } from 'react';
import { Platform, View } from 'react-native';
import StyledButton from '../../src/components/common/StyledButton';
import { useTheme } from '../../src/contexts/ThemeContext';
import StyledAlert from '../../src/components/common/StyledAlert';

export default function Profile() {
  const { user, loadingUser, refetchUser } = useUser();
  const { theme, mode } = useTheme();

  useFocusEffect(
    useCallback(() => {
      refetchUser(); // <- Refresca los datos del usuario al entrar
    }, [])
  );
  if (loadingUser) {
    return (
      <PageContainer>
        <LoadingIndicator text='Cargando datos…' />
      </PageContainer>
    );
  }

  if (Platform.OS === 'android' && !user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background.primary,
          padding: 20,
        }}
      >
        <StyledAlert
          variant='info'
          message='Para poder ver tu perfil, debes iniciar sesión.'
        />
        <StyledButton
          title='Iniciar sesión'
          onPress={() => router.push('/login')}
        />
      </View>
    );
  }

  if (!user) {
    return <Redirect href='/login' />;
  }

  return (
    <PageContainer>
      <PerfilScreen />
    </PageContainer>
  );
}
