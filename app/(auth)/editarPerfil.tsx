import { useEffect } from 'react';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';
import { useUser } from '../../src/contexts/UserContext';
import { router } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import EditarPerfilScreen from '../../src/screens/auth/EditarPerfilScreen';

export default function EditarPerfilPage() {
  const { user, loadingUser } = useUser();

  useEffect(() => {
    if (loadingUser) return;
    if (!user) router.replace('/login');
    console.log(user, loadingUser);
  }, [loadingUser, user]);

  if (loadingUser) {
    return <LoadingIndicator text='Cargando perfil...' />;
  }

  return (
    <PageContainer>
      <EditarPerfilScreen />
    </PageContainer>
  );
}
