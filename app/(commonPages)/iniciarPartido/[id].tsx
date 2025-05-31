import { router, Stack, useLocalSearchParams } from 'expo-router';
import LoadingIndicator from '../../../src/components/common/LoadingIndicator';
import { useUser } from '../../../src/contexts/UserContext';
import PageContainer from '../../../src/components/layout/PageContainer';
import ModoMesaScreen from '../../../src/screens/modoMesa/ModoMesaScreen';
import { TipoCompeticion } from '../../../src/types/Competicion';

export default function modoMesaPage() {
  const { user, loadingUser } = useUser();
  const { id, tipoCompeticion } = useLocalSearchParams<{
    id: string;
    tipoCompeticion: TipoCompeticion;
  }>(); // 1️⃣

  if (loadingUser) {
    return <LoadingIndicator text='Cargando informacion de usuario…' />;
  }

  if (user?.rol !== 'arbitro') {
    router.replace('/');
  }
  return (
    <>
      <Stack.Screen
        options={{
          gestureEnabled: false, //forzamos que no se pueda deslizar para volver atrás
        }}
      />
      <ModoMesaScreen idPartido={id} tipoCompeticion={tipoCompeticion} />
    </>
  );
}
