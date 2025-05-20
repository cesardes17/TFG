import { TouchableOpacity } from 'react-native';
import HeaderConfig from '../../../src/components/layout/HeaderConfig';
import PageContainer from '../../../src/components/layout/PageContainer';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useUser } from '../../../src/contexts/UserContext';
import { useMarcarVisitaTablon } from '../../../src/hooks/useMarcarVisitaTablon';
import TablonAnunciosScreen from '../../../src/screens/anuncios/TablonAnunciosScreen';
import { AddIcon } from '../../../src/components/Icons';
import { router } from 'expo-router';

export default function TablonAnunciosPage() {
  useMarcarVisitaTablon();
  const { theme } = useTheme();
  const { user } = useUser();

  const headerRight = () => {
    if (user?.role !== 'organizador' && user?.role !== 'coorganizador')
      return null;
    return (
      <TouchableOpacity onPress={() => router.push('/nuevaSolicitud')}>
        <AddIcon color={theme.text.light} />
      </TouchableOpacity>
    );
  };
  return (
    <PageContainer>
      <HeaderConfig title='Tablón de Anuncios' HeaderRight={headerRight()} />
      <TablonAnunciosScreen />
    </PageContainer>
  );
}
