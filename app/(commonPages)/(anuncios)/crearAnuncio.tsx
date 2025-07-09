import { Platform } from 'react-native';
import PageContainer from '../../../src/components/layout/PageContainer';
import CrearAnuncioScreen from '../../../src/screens/anuncios/CrearAnuncioScreen';
import HeaderConfig from '../../../src/components/layout/HeaderConfig';

export default function CrearAnuncioPage() {
  return (
    <PageContainer>
      {<HeaderConfig title='Crear Anuncio' />}
      <CrearAnuncioScreen />
    </PageContainer>
  );
}
