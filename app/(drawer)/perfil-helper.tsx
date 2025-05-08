// app/profile.tsx
import { View, Text } from 'react-native';
import { useUser } from '../../src/contexts/UserContext';
import { useEffect } from 'react';
import { router } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import PerfilScreen from '../../src/screens/user/PerfilScreen';
export default function Profile() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user) return router.push('/login');
  }, []);

  return (
    <PageContainer>
      <PerfilScreen />
    </PageContainer>
  );
}
