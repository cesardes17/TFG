import { useEffect } from 'react';
import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import PageContainer from '../../../src/components/layout/PageContainer';
import { useUser } from '../../../src/contexts/UserContext';
import SolicitudesScreen from '../../../src/screens/solicitud/SolicitudesScreen';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AddIcon } from '../../../src/components/Icons';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useTemporadaContext } from '../../../src/contexts/TemporadaContext';

export default function SolicitudesPage() {
  const { theme } = useTheme();
  const { user, loadingUser } = useUser();
  const { temporada } = useTemporadaContext();

  useEffect(() => {
    if (loadingUser) return;
    if (!user) return router.replace('/');
    //no tienen acceso a esta pagina
    if (user.rol === 'arbitro' || user.rol === 'espectador')
      return router.replace('/');
  }, []);

  if (loadingUser) return null;

  const headerRight = () => {
    if (
      user?.rol === 'organizador' ||
      user?.rol === 'coorganizador' ||
      !temporada
    )
      return null;
    return (
      <TouchableOpacity onPress={() => router.push('/nuevaSolicitud')}>
        <AddIcon color={theme.text.light} />
      </TouchableOpacity>
    );
  };

  return (
    <PageContainer>
      <HeaderConfig
        title='Solicitudes'
        backLabel='Más'
        HeaderRight={headerRight()}
      />
      <SolicitudesScreen />
    </PageContainer>
  );
}
