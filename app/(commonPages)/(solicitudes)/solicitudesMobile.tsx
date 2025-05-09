import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import PageContainer from '../../../src/components/layout/PageContainer';
import SolicitudesScreen from '../../../src/screens/solicitud/SolicitudesScreen';

export default function SolicitudesPage() {
  return (
    <PageContainer>
      <HeaderConfig title='Solicitudes' backLabel='Más' />
      <SolicitudesScreen />
    </PageContainer>
  );
}
