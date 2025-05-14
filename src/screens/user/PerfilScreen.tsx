import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import StyledAlert from '../../components/common/StyledAlert';
import StyledButton from '../../components/common/StyledButton';
import { AuthService } from '../../services/core/authService';
import ShowUserInfo from '../../components/user/ShowUserInfo';
import InscripcionBolsa from '../../components/bolsaJugadores/InscripcionBolsa';

export default function PerfilScreen() {
  const { theme } = useTheme();
  const { loadingTemporada } = useTemporadaContext();
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (loadingTemporada || loadingUser || isLoading) {
    return <ActivityIndicator size='large' color={theme.text.primary} />;
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <StyledAlert variant='error' message='No hay usuario Activo' />
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
