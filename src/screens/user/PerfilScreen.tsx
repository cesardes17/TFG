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
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export default function PerfilScreen() {
  const { loadingTemporada } = useTemporadaContext();
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { layoutType } = useResponsiveLayout();

  if (loadingTemporada || loadingUser || isLoading) {
    return <LoadingIndicator text='Cargando informacion...' />;
  }

  if (!user) {
    return;
  }
  let editarPerfil = false;
  if (user.rol === 'espectador') {
    editarPerfil = true;
  } else if (user.rol === 'jugador' && !user.equipo) {
    editarPerfil = true;
  } else {
    //si no es espectador o jugador sin equipo no puede editar el perfil
    editarPerfil = false;
  }

  return (
    <View
      style={
        layoutType === 'mobile' || layoutType === 'tablet'
          ? styles.containerMobile
          : styles.containerDesktop
      }
    >
      <ShowUserInfo screenLoading={setIsLoading} />
      {user.rol === 'jugador' && !user.equipo && (
        <InscripcionBolsa screenLoading={setIsLoading} />
      )}
      <View
        style={
          layoutType === 'mobile' || layoutType === 'tablet'
            ? styles.botonesMobile
            : styles.botonesDesktop
        }
      >
        {editarPerfil && (
          <View style={styles.buttonContainer}>
            <StyledButton
              title='Editar Perfil'
              onPress={() => {
                router.push('/editarPerfil');
              }}
            />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <StyledButton
            variant='error'
            onPress={async () => {
              setIsLoading(true);
              await AuthService.logout();
              setIsLoading(false);
              router.replace('/');
            }}
            title='Cerrar Sesión'
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerDesktop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerMobile: {
    flex: 1,
    alignItems: 'center',
  },
  botonesDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    minWidth: '100%',
    paddingHorizontal: 20,
    gap: 20, // Espacio entre los botones, ajusta según tus preferenci
  },
  botonesMobile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    // flex: 1,
  },
});
