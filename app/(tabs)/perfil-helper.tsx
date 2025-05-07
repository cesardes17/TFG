// app/profile.tsx

import PageContainer from '../../src/components/layout/PageContainer';
import StyledText from '../../src/components/common/StyledText';
import { useUser } from '../../src/contexts/UserContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Profile() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user) return router.push('/login');
  }, []);

  return (
    <PageContainer>
      <StyledText>Pantalla Perfil</StyledText>
    </PageContainer>
  );
}
