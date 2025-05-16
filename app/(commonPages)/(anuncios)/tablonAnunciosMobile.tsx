import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import PageContainer from '../../../src/components/layout/PageContainer';
import TablonAnunciosScreen from '../../../src/screens/anuncios/TablonAnunciosScreen';

export default function TablonAnunciosPage() {
  return (
    <PageContainer>
      <HeaderConfig title='Tablon de Anuncios' />
      <TablonAnunciosScreen />
    </PageContainer>
  );
}
