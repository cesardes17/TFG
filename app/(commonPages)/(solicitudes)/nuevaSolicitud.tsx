import { Platform } from 'react-native';
import PageContainer from '../../../src/components/layout/PageContainer';
import NuevaSolicitudScreen from '../../../src/screens/solicitud/NuevaSolicitudScreen';
import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import { useUser } from '../../../src/contexts/UserContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function NuevaSolicitudPage() {
  const { user, loadingUser } = useUser();

  useEffect(() => {
    if (loadingUser) return;
    if (!user) return router.replace('/');
    //solo tienen acceso a esta pagina
    if (user.rol !== 'jugador' && user.rol !== 'capitan')
      return router.replace('/');
  }, []);

  if (loadingUser) return null;

  return (
    <PageContainer>
      {<HeaderConfig title='Nueva Solicitud' />}
      <NuevaSolicitudScreen />
    </PageContainer>
  );
}
