import { View } from 'react-native';
import PageContainer from '../../src/components/layout/PageContainer';
import HeaderConfig from '../../src/components/layout/HeaderConfig';
import BolsaJugadoresScreen from '../../src/screens/BolsaJugadoresScreen';
import { useUser } from '../../src/contexts/UserContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function BolsaJugadorPage() {
  const { user, loadingUser } = useUser();

  useEffect(() => {
    if (loadingUser) return;
    if (!user) return router.replace('/');
    //no tienen acceso a esta pagina
    if (
      user.role !== 'capitan' &&
      user.role !== 'coorganizador' &&
      user.role !== 'organizador'
    )
      return router.replace('/');
  }, []);

  if (loadingUser) return null;

  return (
    <PageContainer>
      <HeaderConfig title='Bolsa de Jugadores' />
      <BolsaJugadoresScreen />
    </PageContainer>
  );
}
