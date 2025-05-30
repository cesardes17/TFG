import { router } from 'expo-router';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';
import { useUser } from '../../src/contexts/UserContext';
import PageContainer from '../../src/components/layout/PageContainer';
import ModoMesaScreen from '../../src/screens/modoMesa/ModoMesaScreen';

export default function modoMesaPage() {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return <LoadingIndicator text='Cargando informacion de usuario…' />;
  }

  if (user?.rol !== 'arbitro') {
    router.replace('/');
  }
  return <ModoMesaScreen />;
}
