import { StyleSheet, View } from 'react-native';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';

import StyledButton from '../../components/common/StyledButton';
import { AuthService } from '../../services/core/authService';
import ShowUserInfo from '../../components/user/ShowUserInfo';
import InscripcionBolsa from '../../components/bolsaJugadores/InscripcionBolsa';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { router } from 'expo-router';

export default function PerfilScreen() {
  const { loadingTemporada } = useTemporadaContext();
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (loadingTemporada || loadingUser || isLoading) {
    return <LoadingIndicator text='Cargando informacion...' />;
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <LoadingIndicator text='Cargando informacion...' />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ShowUserInfo screenLoading={setIsLoading} />
      {user.role === 'jugador' && !user.equipo && (
        <InscripcionBolsa screenLoading={setIsLoading} />
      )}
      <StyledButton
        variant='error'
        onPress={() => {
          setIsLoading(true);
          AuthService.logout();
          setIsLoading(false);
          router.replace('/');
        }}
        title='Cerrar Sesión'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
