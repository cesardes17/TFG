// app/(tabs)/perfil-helper.tsx
import { Redirect } from 'expo-router';
import { useUser } from '../../src/contexts/UserContext';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';
import PerfilScreen from '../../src/screens/user/PerfilScreen';
import PageContainer from '../../src/components/layout/PageContainer';

export default function Profile() {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return (
      <PageContainer>
        <LoadingIndicator text='Cargando datos…' />
      </PageContainer>
    );
  }

  // ¡Ojo! Aquí no usamos router.push, sino <Navigate>
  if (!user) {
    return <Redirect href='/login' />;
  }

  return (
    <PageContainer>
      <PerfilScreen />
    </PageContainer>
  );
}
