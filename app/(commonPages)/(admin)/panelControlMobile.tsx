import { useEffect } from 'react';
import { router } from 'expo-router';
import { useUser } from '../../../src/contexts/UserContext';
import PageContainer from '../../../src/components/layout/PageContainer';
import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import PanelControlScreen from '../../../src/screens/admin/PanelControlScreen';

export default function PanelControlPage() {
  const { user, loadingUser } = useUser();

  useEffect(() => {
    if (loadingUser) return;
    if (!user) return router.replace('/');
    //no tienen acceso a esta pagina
    if (user.role !== 'coorganizador' && user.role !== 'organizador')
      return router.replace('/');
  }, []);

  if (loadingUser) return null;

  return (
    <PageContainer>
      <HeaderConfig title='Panel de Control' backLabel='Más' />
      <PanelControlScreen />
    </PageContainer>
  );
}
