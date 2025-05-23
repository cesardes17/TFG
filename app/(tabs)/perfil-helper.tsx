// app/(tabs)/perfil-helper.tsx
import { Redirect, useFocusEffect } from 'expo-router';
import { useUser } from '../../src/contexts/UserContext';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';
import PerfilScreen from '../../src/screens/user/PerfilScreen';
import PageContainer from '../../src/components/layout/PageContainer';
import { useCallback } from 'react';

export default function Profile() {
  const { user, loadingUser, refetchUser } = useUser();

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

  // ¡Ojo! Aquí no usamos router.push, sino <Navigate>
  if (!user) {
    return <Redirect href='/login' />;
  }

  return (
    <PageContainer>
      <PerfilScreen />
    </PageContainer>
  );
}
