import { Platform } from 'react-native';
import PageContainer from '../../../src/components/layout/PageContainer';
import NuevaSolicitudScreen from '../../../src/screens/solicitud/NuevaSolicitudScreen';
import HeaderConfig from '../../../src/components/layout/HeaderConfig';

export default function NuevaSolicitudPage() {
  return (
    <PageContainer>
      {Platform.OS !== 'web' && (
        <HeaderConfig title='Nueva Solicitud' backLabel='Más' />
      )}
      <NuevaSolicitudScreen />
    </PageContainer>
  );
}
