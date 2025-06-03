import { useLocalSearchParams } from 'expo-router/build/hooks';
import PageContainer from '../../src/components/layout/PageContainer';
import EquipoInfoScreen from '../../src/screens/EquipoInfoScreen';
import HeaderConfig from '../../src/components/layout/HeaderConfig';
import JugadorInfoScreen from '../../src/screens/JugadorInfoScreen';

export default function EquipoInfoPage() {
  const { id } = useLocalSearchParams<{ id: string }>(); // 1️⃣

  return (
    <PageContainer>
      <HeaderConfig title='Información de Jugador' />
      <JugadorInfoScreen jugadorId={id} />
    </PageContainer>
  );
}
