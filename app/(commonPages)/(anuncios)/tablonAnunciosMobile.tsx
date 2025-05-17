import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import PageContainer from '../../../src/components/layout/PageContainer';
import { useMarcarVisitaTablon } from '../../../src/hooks/useMarcarVisitaTablon';
import TablonAnunciosScreen from '../../../src/screens/anuncios/TablonAnunciosScreen';

export default function TablonAnunciosPage() {
  useMarcarVisitaTablon();

  return (
    <PageContainer>
      <HeaderConfig title='Tablón de Anuncios' />
      <TablonAnunciosScreen />
    </PageContainer>
  );
}
