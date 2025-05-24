import { useEffect } from 'react';
import PageContainer from '../../src/components/layout/PageContainer';
import { useUser } from '../../src/contexts/UserContext';
import SolicitudesScreen from '../../src/screens/solicitud/SolicitudesScreen';
import { router } from 'expo-router';
import Drawer from 'expo-router/drawer';
import { DrawerLabelWithBadge } from '../../src/components/drawer/DrawerLabelWithBadge';
import { useVerificarSolicitudes } from '../../src/hooks/useVerificarSolicitudes';

export default function SolicitudesPage() {
  const { user, loadingUser } = useUser();
  const nSolicitudesNuevas = useVerificarSolicitudes();
  useEffect(() => {
    if (loadingUser) {
      return;
    }

    if (!user) {
      return router.replace('/login');
    }
  }, [loadingUser, user]);

  if (loadingUser || !user) {
    return null;
  }

  return (
    <PageContainer>
      <Drawer.Screen
        options={{
          drawerLabel: () => (
            <DrawerLabelWithBadge
              label='Solicitudes'
              badgeCount={nSolicitudesNuevas}
            />
          ),
          title: 'Solicitudes',
          drawerItemStyle: {
            display:
              user?.rol !== 'espectador' && user?.rol !== 'arbitro'
                ? 'flex'
                : 'none',
          },
        }}
      />
      <SolicitudesScreen />
    </PageContainer>
  );
}
