import { useEffect } from 'react';
import PageContainer from '../../src/components/layout/PageContainer';
import { useUser } from '../../src/contexts/UserContext';
import SolicitudesScreen from '../../src/screens/solicitud/SolicitudesScreen';
import { router } from 'expo-router';

export default function SolicitudesPage() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      return router.replace('/login');
    }
  }, [loading, user]);

  if (loading || !user) {
    return null;
  }

  return (
    <PageContainer>
      <SolicitudesScreen />
    </PageContainer>
  );
}
