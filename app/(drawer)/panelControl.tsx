import { useEffect } from 'react';
import StyledText from '../../src/components/common/StyledText';
import PageContainer from '../../src/components/layout/PageContainer';
import { useUser } from '../../src/contexts/UserContext';
import PanelControlScreen from '../../src/screens/admin/PanelControlScreen';
import { router } from 'expo-router';

export default function PanelControlPage() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading || !user) {
      return;
    }
    if (user.role !== 'coorganizador' && user.role !== 'organizador') {
      return router.replace('/');
    }
  }, [loading, user]);

  if (loading) {
    return null;
  }

  return (
    <PageContainer>
      <PanelControlScreen />
    </PageContainer>
  );
}
