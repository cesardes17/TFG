import {
  View,
  StyleSheet,
  ActivityIndicator,
  SwitchComponent,
} from 'react-native';
import { AuthService } from '../../services/core/authService';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import ShowUserInfo from '../../components/user/ShowUserInfo';
import { useUser } from '../../contexts/UserContext';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { bolsaJugadoresService } from '../../services/bolsaService';
import { useToast } from '../../contexts/ToastContext';
import { useEffect, useState } from 'react';
import StyledButton from '../../components/common/StyledButton';
import { BolsaJugador } from '../../types/BolsaJugador';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import { getRandomUID } from '../../utils/getRandomUID';

type accionModal = 'desinscripcion';

export default function PerfilScreen() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { temporada } = useTemporadaContext();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalConfirmLabel, setmodalConfirmLabel] = useState('');
  const [inscritoBolsa, setInscritoBolsa] = useState<{
    inscrito: boolean;
    id: string;
  }>({
    inscrito: false,
    id: '',
  });
  const [accionModal, setAccionModal] = useState<accionModal>('desinscripcion');
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleInscripcion = async () => {
    if (!temporada) {
      showToast('No hay una temporada activa', 'error');
      return null;
    }
    if (!temporada.activa) {
      showToast('La temporada no está abierta', 'error');
      return null;
    }
    if (user?.role !== 'jugador') {
      showToast('Solo los jugadores pueden inscribirse a la bolsa', 'error');
      return null;
    }
    const jugadorData: BolsaJugador = {
      id: getRandomUID(),
      createdAt: new Date().toDateString(),
      jugador: {
        id: user!.uid!,
        nombre: user!.nombre!,
        apellidos: user!.apellidos!,
        correo: user!.correo!,
        dorsal: user!.dorsal!,
        altura: user!.altura!,
        peso: user!.peso!,
        posicion: user!.posicion!,
        photoURL: user!.photoURL!,
      },
    };

    const res = await bolsaJugadoresService.inscribirJugador(
      temporada.id,
      jugadorData
    );

    if (res.success) {
      showToast('Inscripción exitosa', 'success');
      checkInscripcion(); // Añadido para actualizar la UI
    } else {
      showToast('Error al inscribirse', 'error');
    }
  };

  const handleDesinscirbir = async () => {
    if (!temporada) {
      showToast('No hay una temporada activa', 'error');
      return null;
    }
    if (!temporada.activa) {
      showToast('La temporada no está abierta', 'error');
      return null;
    }
    const res = await bolsaJugadoresService.deleteJugadorInscrito(
      inscritoBolsa.id,
      temporada.id
    );

    console.log('Perfil Screen - res: ', res);
    if (res.success) {
      showToast('Desinscripción exitosa', 'success'); // Corregido el mensaje
      checkInscripcion(); // Añadido para actualizar la UI
      setShowModal(false); // Cerrar el modal después de desinscribirse
    } else {
      showToast('Error al desinscribirse', 'error'); // Corregido el mensaje
    }
  };

  const checkInscripcion = async () => {
    if (!temporada || !temporada.activa) {
      setInscritoBolsa({ inscrito: false, id: '' });
      return;
    }

    const res = await bolsaJugadoresService.getJugadorInscrito(
      user!.uid!,
      temporada.id
    );

    if (res.success && res.data) {
      setInscritoBolsa({ inscrito: true, id: res.data.id });
    } else {
      setInscritoBolsa({ inscrito: false, id: '' });
    }
  };

  const handleModal = () => {
    switch (accionModal) {
      case 'desinscripcion':
        handleDesinscirbir();
        break;
      default:
        break;
    }
    return;
  };
  useEffect(() => {
    const initCheck = async () => {
      await checkInscripcion();

      setIsLoading(false);
    };

    if (user && temporada) {
      initCheck();
    }
  }, [user, temporada]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color={theme.text.primary} />
      </View>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <View style={styles.container}>
      <ShowUserInfo user={user} />

      {user?.role === 'jugador' && !user.equipo && (
        <StyledButton
          title={
            inscritoBolsa.inscrito
              ? 'Desinscribete de la Bolsa de Jugadores'
              : 'Inscribite en la Bolsa de Jugadores'
          }
          onPress={() => {
            if (inscritoBolsa.inscrito) {
              setAccionModal('desinscripcion');
              setModalTitle('Baja de Bolsa de Jugadores');
              setModalMsg(
                '¿Estás seguro de darte de baja de la bolsa de Jugadores?'
              );
              setmodalConfirmLabel('Dar de Baja');
              setShowModal(true);
            } else {
              handleInscripcion();
            }
          }}
          variant='outline'
        />
      )}

      <StyledButton
        title='Cerrar Sesión'
        onPress={handleLogout}
        variant='error'
      />

      <BaseConfirmationModal
        visible={showModal}
        title={modalTitle}
        description={modalMsg}
        onConfirm={handleModal}
        onCancel={() => setShowModal(false)}
        type='delete'
        confirmLabel={modalConfirmLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
