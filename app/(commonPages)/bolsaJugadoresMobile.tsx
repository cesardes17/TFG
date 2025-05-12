import { View } from 'react-native';
import PageContainer from '../../src/components/layout/PageContainer';
import HeaderConfig from '../../src/components/layout/HeaderConfig';
import BolsaJugadoresScreen from '../../src/screens/BolsaJugadoresScreen';

export default function BolsaJugadorPage() {
  return (
    <PageContainer>
      <HeaderConfig title='Bolsa de Jugadores' />
      <BolsaJugadoresScreen />
    </PageContainer>
  );
}
