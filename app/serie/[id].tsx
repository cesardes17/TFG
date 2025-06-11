import { useLocalSearchParams } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import HeaderConfig from '../../src/components/layout/HeaderConfig';
import SerieInfoScreen from '../../src/screens/series/SerieInfoScreen';

export default function SeriePage() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  return (
    <PageContainer>
      <HeaderConfig title='Partido' />
      <SerieInfoScreen serieId={id} />
    </PageContainer>
  );
}
