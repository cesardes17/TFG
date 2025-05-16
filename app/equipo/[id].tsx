import { useLocalSearchParams } from 'expo-router/build/hooks';
import PageContainer from '../../src/components/layout/PageContainer';
import EquipoInfoScreen from '../../src/screens/EquipoInfoScreen';
import HeaderConfig from '../../src/components/layout/HeaderConfig';

export default function EquipoInfoPage() {
  const { id } = useLocalSearchParams<{ id: string }>(); // 1️⃣

  return (
    <PageContainer>
      <HeaderConfig title='Equipo' />
      <EquipoInfoScreen equipoId={id} />
    </PageContainer>
  );
}
