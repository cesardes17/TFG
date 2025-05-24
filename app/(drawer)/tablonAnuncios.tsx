import Drawer from 'expo-router/drawer';
import PageContainer from '../../src/components/layout/PageContainer';
import { useMarcarVisitaTablon } from '../../src/hooks/useMarcarVisitaTablon';
import TablonAnunciosScreen from '../../src/screens/anuncios/TablonAnunciosScreen';
import { DrawerLabelWithBadge } from '../../src/components/drawer/DrawerLabelWithBadge';

export default function TablonAnunciosPage() {
  useMarcarVisitaTablon();

  return (
    <PageContainer>
      <Drawer.Screen
        options={{
          drawerLabel: () => <DrawerLabelWithBadge label='Anuncios' />,
          title: 'Tablon de Anuncios',
        }}
      />
      <TablonAnunciosScreen />
    </PageContainer>
  );
}
