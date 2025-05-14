import { useEffect } from 'react';
import PageContainer from '../../src/components/layout/PageContainer';
import { useUser } from '../../src/contexts/UserContext';
import SolicitudesScreen from '../../src/screens/solicitud/SolicitudesScreen';
import { router } from 'expo-router';

export default function SolicitudesPage() {
  const { user, loadingUser } = useUser();

  useEffect(() => {
    if (loadingUser) {
      return;
    }

    if (!user) {
      return router.replace('/login');
    }
  }, [loadingUser, user]);

  if (loadingUser || !user) {
    return null;
  }

  return (
    <PageContainer>
      <SolicitudesScreen />
    </PageContainer>
  );
}
