// app/profile.tsx
import { useUser } from '../../src/contexts/UserContext';
import { useCallback, useEffect } from 'react';
import { router, useFocusEffect } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import PerfilScreen from '../../src/screens/user/PerfilScreen';
export default function Profile() {
  const { user, loadingUser, refetchUser } = useUser();

  useFocusEffect(
    useCallback(() => {
      refetchUser();
    }, [refetchUser])
  );

  useEffect(() => {
    if (loadingUser) {
      return;
    }
    if (!user) {
      console.log('no user');
      return router.replace('/login');
    }
  }, [loadingUser, user]);

  if (loadingUser) {
    return null;
  }

  return (
    <PageContainer>
      <PerfilScreen />
    </PageContainer>
  );
}
