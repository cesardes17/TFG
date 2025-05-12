// app/profile.tsx

import PageContainer from '../../src/components/layout/PageContainer';
import StyledText from '../../src/components/common/StyledText';
import { useUser } from '../../src/contexts/UserContext';
import { useEffect } from 'react';
import { router } from 'expo-router';
import PerfilScreen from '../../src/screens/user/PerfilScreen';

export default function Profile() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      return router.replace('/login');
    }
  }, [loading, user]);

  if (loading) {
    return null;
  }
  return (
    <PageContainer>
      <PerfilScreen />
    </PageContainer>
  );
}
