import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BaseSolicitudService } from '../../services/solicitudesService';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useUser } from '../../contexts/UserContext';
import type { WhereFilterOp } from 'firebase/firestore';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import StyledAlert from '../common/StyledAlert';
import {
  Solicitud,
  solicitudSalirEquipo,
  solicitudUnirseEquipo,
} from '../../types/Solicitud';
import SolicitudCard from './SolicitudCard';
import BaseConfirmationModal, {
  ConfirmationType,
} from '../common/BaseConfirmationModal';
import StyledText from '../common/StyledText';
import StyledTextInput from '../common/StyledTextInput';
import rechazarSolicitud from '../../utils/solicitudes/rechazarSolicitud';
import { useToast } from '../../contexts/ToastContext';
import aceptarSolicitud from '../../utils/solicitudes/aceptarSolicitud';
import { inscripcionesService } from '../../services/inscripcionesService';
import { AddIcon, FilterIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';

interface SolicitudesListProps {
  screenLoading: (isLoading: boolean) => void;
}

export default function SolicitudesList({
  screenLoading,
}: SolicitudesListProps) {
  const { theme } = useTheme();
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const { showToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>(
    []
  ); //anuncios filtrados por busqued
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(
    null
  );
  const [dorsalesOcupados, setDorsalesOcupados] = useState<number[]>([]);
  const [inputModal, setInputModal] = useState('');
  const [inputError, setInputError] = useState('');
  const [mostrarInputModal, setMostrarInputModal] = useState(false);
  const [modalType, setModalType] = useState<ConfirmationType>('update');
  const [query, setQuery] = useState('');
  const [estado, setEStado] = useState('');
  const isAdmin =
    user?.role === 'organizador' || user?.role === 'coorganizador';

  const fetchSolicitudes = useCallback(async () => {
    if (!temporada) return;

    const andFilters: [string, WhereFilterOp, any][] = [];
    const orFilters: [string, WhereFilterOp, any][] = !isAdmin
      ? [
          ['solicitante.id', '==', user!.uid],
          ['jugadorObjetivo.id', '==', user!.uid],
          ['capitanObjetivo.id', '==', user!.uid],
        ]
      : [];

    const res = await BaseSolicitudService.getSolicitudesWithFilters(
      temporada.id,
      andFilters,
      orFilters
    );

    if (res.success) {
      setSolicitudes(res.data!);
      setFilteredSolicitudes(res.data!);
    }
  }, [temporada?.id, user?.uid, isAdmin]);

  useFocusEffect(
    useCallback(() => {
      screenLoading(true);
      fetchSolicitudes();
      screenLoading(false);
      // opcional: return () => { cancelar peticiones si usas abortController }
    }, [fetchSolicitudes])
  );

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredSolicitudes(solicitudes);
      return;
    }

    const filtered = solicitudes.filter((s) => {
      // 1) Siempre filtro por solicitante
      const solicitante = s.solicitante;
      const matchSolicitante =
        solicitante.nombre.toLowerCase().includes(q) ||
        solicitante.apellidos.toLowerCase().includes(q) ||
        solicitante.correo.toLowerCase().includes(q);

      // 2) Si es "Unirse a Equipo", filtro también por jugadorObjetivo y equipoObjetivo
      let matchUnirse = false;
      if (s.tipo === 'Unirse a Equipo') {
        const u = s as solicitudUnirseEquipo;
        matchUnirse =
          u.jugadorObjetivo.nombre.toLowerCase().includes(q) ||
          u.jugadorObjetivo.apellidos.toLowerCase().includes(q) ||
          u.jugadorObjetivo.correo.toLowerCase().includes(q) ||
          u.equipoObjetivo.nombre.toLowerCase().includes(q);
      }

      // 3) Si es "Salir de Equipo", filtro por capitánObjetivo
      let matchSalir = false;
      if (s.tipo === 'Salir de Equipo') {
        const sal = s as solicitudSalirEquipo;
        matchSalir =
          (
            sal.capitanObjetivo.nombre.toLowerCase() +
            ' ' +
            sal.capitanObjetivo.apellidos.toLowerCase()
          ).includes(q) || sal.capitanObjetivo.correo.toLowerCase().includes(q);
      }

      // 4) Para “Crear Equipo” y “Disolver Equipo” no hay otros campos que filtrar
      return matchSolicitante || matchUnirse || matchSalir;
    });

    setFilteredSolicitudes(filtered);
  }, [query, solicitudes]);
  const onAceptar = async (solicitud: Solicitud) => {
    console.log('aceptar Solicitud: ', solicitud);

    // Si es “Unirse a Equipo” y el usuario es jugador...
    if (solicitud.tipo === 'Unirse a Equipo' && user?.role === 'jugador') {
      console.log('OBTENIENDO DORSALES');

      // Usa directamente `solicitud.equipoObjetivo.id`, no selectedSolicitud
      const equipoId = (solicitud as solicitudUnirseEquipo).equipoObjetivo.id;
      const res = await inscripcionesService.getDorsalesByTeam(
        temporada!.id,
        equipoId
      );
      console.log('RESULTADO DE OBTENER DORSALES - ', res);
      if (!res.success) {
        throw new Error('Error al obtener los dorsales del equipo');
      }
      setDorsalesOcupados(res.data!);
      setMostrarInputModal(true);
    } else {
      setDorsalesOcupados([]);
      setMostrarInputModal(false);
    }

    // Ahora sí setea la solicitud seleccionada
    setSelectedSolicitud(solicitud);
    setModalTitle(
      solicitud.tipo === 'Unirse a Equipo' && user?.role === 'jugador'
        ? 'Introduzca su Dorsal para confirmar inscripción'
        : '¿Está seguro de confirmar la solicitud?'
    );
    setModalType('update');
    setModalVisible(true);
  };

  const onRechazar = (solicitud: Solicitud) => {
    console.log('rechazar Solicitud: ', solicitud);
    setModalTitle('¿Está seguro de rechazar la solicitud?');
    setModalVisible(true);
    setSelectedSolicitud(solicitud);
    setMostrarInputModal(true);
    setModalType('delete');
  };

  const handleConfirm = async () => {
    screenLoading(true);
    if (!selectedSolicitud || !temporada || !user) {
      console.error(
        'No hay temporada, no hay usuario, o no hay solicitud seleccionada'
      );
      return;
    }

    if (modalType === 'update') {
      //validacion previa de input si es dorsal
      if (
        selectedSolicitud.tipo === 'Unirse a Equipo' &&
        user.role === 'jugador'
      ) {
        const dorsal = parseInt(inputModal);
        const isValidDorsal =
          !isNaN(dorsal) && !dorsalesOcupados.includes(dorsal);
        if (!isValidDorsal) {
          setInputError('Dorsal no válido');
          screenLoading(false);
          return;
        }
      }

      const res = await aceptarSolicitud(
        temporada.id,
        selectedSolicitud,
        user,
        inputModal
      );
      showToast(res.message, res.type);
    } else {
      const res = await rechazarSolicitud(
        temporada.id,
        selectedSolicitud,
        user,
        inputModal
      );
      showToast(res.message, res.type);
    }
    screenLoading(false);
  };

  const renderInputModal = () => {
    return (
      <>
        {dorsalesOcupados.length > 0 && modalType === 'update' && (
          <StyledText variant='secondary' style={{ marginBottom: 8 }}>
            Dorsales ocupados: {dorsalesOcupados.join(', ')}
          </StyledText>
        )}
        <StyledTextInput
          multiline
          placeholder={
            selectedSolicitud!.tipo === 'Unirse a Equipo' &&
            modalType === 'update'
              ? 'Introduce tu dorsal'
              : 'Motivo del rechazo'
          }
          value={inputModal}
          onChangeText={setInputModal}
          error={!!inputError}
        />
        {inputError.trim() !== '' && (
          <StyledText variant='error'>{inputError}</StyledText>
        )}
      </>
    );
  };

  const renderItem = ({ item }: { item: Solicitud }) => {
    return (
      <SolicitudCard
        solicitud={item}
        onAceptar={onAceptar}
        onRechazar={onRechazar}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {/* Input ocupa el 80% */}
        <StyledTextInput
          placeholder='Buscar por nombre, apellidos o correo'
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.searchInput}
        />

        {/* Botón ocupa el 20% */}
        <TouchableOpacity
          style={[styles.addButton, { borderColor: theme.border.primary }]}
        >
          <FilterIcon color={theme.text.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredSolicitudes}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        style={{ marginTop: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center' }}>
            <StyledAlert variant='info' message='No hay solicitudes' />
          </View>
        }
      />
      <BaseConfirmationModal
        visible={modalVisible}
        type={modalType}
        title={modalTitle}
        confirmLabel={modalType === 'update' ? 'Aceptar' : 'Rechazar'}
        cancelLabel='Cancelar'
        onCancel={() => {
          setModalVisible(false);
          setInputModal('');
        }}
        onConfirm={handleConfirm}
      >
        {mostrarInputModal && renderInputModal()}
      </BaseConfirmationModal>
    </View>
  );
}
const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8, // RN >=0.71, si no usa marginRight en input
  },
  searchInput: {
    flex: 4, // 80% del ancho total (4 de 5)
  },
  addButton: {
    flex: 1, // 20% (1 de 5)
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
