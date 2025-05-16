// app/(tabs)/perfil-helper.tsx
import PageContainer from '../../src/components/layout/PageContainer';
import { useUser } from '../../src/contexts/UserContext';
import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import PerfilScreen from '../../src/screens/user/PerfilScreen';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';

export default function Profile() {
  const { user, loadingUser, refetchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true); // esto no es necesario, pero lo dejo por si acaso
      refetchUser().then(() => {
        setIsLoading(false);
      }); // ya maneja loadingUser internamente
    }, [])
  );

  useEffect(() => {
    console.log('loadingUser: ', loadingUser);
    console.log('user: ', user);
    if (loadingUser || isLoading) return;
    if (!user) {
      return router.push('/login');
    }
  }, [loadingUser, user]);

  if (loadingUser || isLoading) {
    return (
      <PageContainer>
        <LoadingIndicator text='Cargando datos' />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PerfilScreen />
    </PageContainer>
  );
}
