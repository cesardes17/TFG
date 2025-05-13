import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { AuthService } from '../../services/core/authService';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import ShowUserInfo from '../../components/user/ShowUserInfo';
import { useUser } from '../../contexts/UserContext';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { bolsaJugadoresService } from '../../services/bolsaService';
import { useToast } from '../../contexts/ToastContext';
import StyledButton from '../../components/common/StyledButton';
import { BolsaJugador } from '../../types/BolsaJugador';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import { getRandomUID } from '../../utils/getRandomUID';

type accionModal = 'desinscripcion';

export default function PerfilScreen() {
  const { theme } = useTheme();
  const { user, refetchUser } = useUser();
  const { temporada } = useTemporadaContext();
  const { showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalConfirmLabel, setmodalConfirmLabel] = useState('');
  const [accionModal, setAccionModal] = useState<accionModal>('desinscripcion');

  const [inscritoBolsa, setInscritoBolsa] = useState<{
    inscrito: boolean;
    id: string;
  }>({
    inscrito: false,
    id: '',
  });

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
    if (!temporada) return showToast('No hay temporada activa', 'error');
    if (!temporada.activa)
      return showToast('La temporada no está abierta', 'error');
    if (user?.role !== 'jugador')
      return showToast('Solo los jugadores pueden inscribirse', 'error');

    const jugadorData: BolsaJugador = {
      id: getRandomUID(),
      createdAt: new Date().toISOString(),
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
      checkInscripcion();
    } else {
      showToast('Error al inscribirse', 'error');
    }
  };

  const handleDesinscribirse = async () => {
    if (!temporada) return;
    const res = await bolsaJugadoresService.deleteJugadorInscrito(
      temporada.id,
      inscritoBolsa.id
    );

    if (res.success) {
      showToast('Desinscripción exitosa', 'success');
      checkInscripcion();
      setShowModal(false);
    } else {
      showToast('Error al desinscribirse', 'error');
    }
  };

  const checkInscripcion = async () => {
    if (!temporada || !user) return;

    const res = await bolsaJugadoresService.getJugadorInscrito(
      user.uid,
      temporada.id
    );

    if (res.success && res.data) {
      setInscritoBolsa({ inscrito: true, id: res.data.id });
    } else {
      setInscritoBolsa({ inscrito: false, id: '' });
    }
  };

  const handleModal = () => {
    if (accionModal === 'desinscripcion') {
      handleDesinscribirse();
    }
  };

  // 🔁 Refresca cada vez que entras en la pantalla
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        setIsLoading(true);
        await refetchUser();
        await checkInscripcion();
        setIsLoading(false);
      };
      if (user && temporada) {
        refreshData();
      }
    }, [user?.uid, temporada?.id])
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color={theme.text.primary} />
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ShowUserInfo user={user} />

      {user.role === 'jugador' && !user.equipo && (
        <StyledButton
          title={
            inscritoBolsa.inscrito
              ? 'Desinscribirte de la Bolsa de Jugadores'
              : 'Inscribirte en la Bolsa de Jugadores'
          }
          onPress={() => {
            if (inscritoBolsa.inscrito) {
              setAccionModal('desinscripcion');
              setModalTitle('Baja de Bolsa de Jugadores');
              setModalMsg('¿Estás seguro de darte de baja?');
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
