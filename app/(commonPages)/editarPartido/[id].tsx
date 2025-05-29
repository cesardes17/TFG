import { Platform } from 'react-native';
import PageContainer from '../../../src/components/layout/PageContainer';
import NuevaSolicitudScreen from '../../../src/screens/solicitud/NuevaSolicitudScreen';
import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import { useUser } from '../../../src/contexts/UserContext';
import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import EditarPartidoScreen from '../../../src/screens/partido/EditarPartidoScreen';
import { TipoCompeticion } from '../../../src/types/Competicion';

export default function EditarPartidoPage() {
  const { user, loadingUser } = useUser();
  const { id, tipoCompeticion } = useLocalSearchParams<{
    id: string;
    tipoCompeticion: TipoCompeticion;
  }>(); // 1️⃣

  useEffect(() => {
    if (loadingUser) return;
    if (!user) return router.replace('/');
    //solo tienen acceso a esta pagina
    if (user.rol !== 'organizador' && user.rol !== 'coorganizador')
      return router.replace('/');
  }, []);

  if (loadingUser) return null;

  return (
    <PageContainer>
      {Platform.OS !== 'web' && <HeaderConfig title='Editar Partido' />}
      <EditarPartidoScreen idPartido={id} tipoCompeticion={tipoCompeticion} />
    </PageContainer>
  );
}
