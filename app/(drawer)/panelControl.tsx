import { useEffect } from 'react';
import StyledText from '../../src/components/common/StyledText';
import PageContainer from '../../src/components/layout/PageContainer';
import { useUser } from '../../src/contexts/UserContext';
import PanelControlScreen from '../../src/screens/admin/PanelControlScreen';
import { router } from 'expo-router';

export default function PanelControlPage() {
  const { user, loadingUser } = useUser();

  useEffect(() => {
    if (loadingUser) return;
    if (!user) return router.replace('/');
    //no tienen acceso a esta pagina
    if (user.rol !== 'coorganizador' && user.rol !== 'organizador')
      return router.replace('/');
  }, []);

  if (loadingUser) return null;

  return (
    <PageContainer>
      <PanelControlScreen />
    </PageContainer>
  );
}
