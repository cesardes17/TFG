import { useLocalSearchParams } from 'expo-router';
import HeaderConfig from '../../src/components/layout/HeaderConfig';
import PageContainer from '../../src/components/layout/PageContainer';
import PartidoInfoScreen from '../../src/screens/partido/PartidoInfoScreen';
import { TipoCompeticion } from '../../src/types/Competicion';

export default function PartidoPage() {
  const { id, tipoCompeticion } = useLocalSearchParams<{
    id: string;
    tipoCompeticion: TipoCompeticion;
  }>(); // 1️⃣

  return (
    <PageContainer>
      <HeaderConfig title='Partido' />
      <PartidoInfoScreen idPartido={id} tipoCompeticion={tipoCompeticion} />
    </PageContainer>
  );
}
