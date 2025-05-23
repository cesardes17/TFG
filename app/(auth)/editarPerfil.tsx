import { useEffect } from 'react';
import LoadingIndicator from '../../src/components/common/LoadingIndicator';
import { useUser } from '../../src/contexts/UserContext';
import { router, Stack } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import EditarPerfilScreen from '../../src/screens/auth/EditarPerfilScreen';
import { Platform, TouchableOpacity } from 'react-native';
import { ArrowBackIcon, ArrowBackIosIcon } from '../../src/components/Icons';
import StyledText from '../../src/components/common/StyledText';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function EditarPerfilPage() {
  const { user, loadingUser } = useUser();
  const { theme } = useTheme();
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
