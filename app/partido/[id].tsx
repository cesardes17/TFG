import HeaderConfig from '../../src/components/layout/HeaderConfig';
import PageContainer from '../../src/components/layout/PageContainer';
import PartidoInfoScreen from '../../src/screens/PartidoInfoScreen';

export default function PartidoPage() {
  return (
    <PageContainer>
      <HeaderConfig title='Partido' />
      <PartidoInfoScreen />
    </PageContainer>
  );
}
