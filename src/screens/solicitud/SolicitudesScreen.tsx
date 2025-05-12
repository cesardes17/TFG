// src/screens/SolicitudesScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';

import StyledTextInput from '../../components/common/StyledTextInput';
import BaseConfirmationModal, {
  ConfirmationType,
} from '../../components/common/BaseConfirmationModal';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Solicitud,
  solicitudCrearEquipo,
  solicitudUnirseEquipo,
} from '../../types/Solicitud';
import {
  aceptarCrearEquipoSolicitud,
  BaseSolicitudService,
  rechazarCrearEquipoSolicitud,
} from '../../services/solicitudesService';
import SolicitudesList from '../../components/solicitudes/SolicitudesList';
import { router, useFocusEffect } from 'expo-router';
import StyledText from '../../components/common/StyledText';
import { AddIcon } from '../../components/Icons';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../contexts/ToastContext';
import { rechazarUnirseEquipoSolicitud } from '../../services/solicitudesService/joinTeamSolicitud/rechazar';
import { aceptarUnirseEquipoSolicitud } from '../../services/solicitudesService/joinTeamSolicitud/aceptar';
import { inscripcionesService } from '../../services/inscripcionesService';

export default function SolicitudesScreen() {
  const { theme } = useTheme();
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const { showToast } = useToast();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ConfirmationType>('update');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [inputError, setInputError] = useState(false);
  const [dorsalInput, setDorsalInput] = useState('');
  const [dorsalesOcupados, setDorsalesOcupados] = useState<number[]>([]);

  const isAdmin =
    user?.role === 'coorganizador' || user?.role === 'organizador';

  useFocusEffect(
    useCallback(() => {
      if (!temporada) return;

      const fetchSolicitudes = async () => {
        const res = await BaseSolicitudService.getSolicitudes(temporada.id);
        if (res.success && res.data) {
          setSolicitudes(res.data);
        }
      };

      fetchSolicitudes();
    }, [temporada])
  );

  const openAcceptModal = async (id: string) => {
    const solicitud = solicitudes.find((s) => s.id === id);
    setSelectedId(id);
    setModalType('update');
    setModalVisible(true);

    if (
      solicitud?.tipo === 'Unirse a Equipo' &&
      (solicitud as solicitudUnirseEquipo).jugadorObjetivo.id === user?.uid
    ) {
      const equipoId = (solicitud as solicitudUnirseEquipo).equipoObjetivo.id;
      const res = await inscripcionesService.getDorsalesByTeam(
        temporada!.id,
        equipoId
      );
      if (res.success && res.data) {
        setDorsalesOcupados(res.data);
      }
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedId(id);
    setModalType('delete');
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    const solicitud = solicitudes.find((s) => s.id === selectedId);
    if (!selectedId || !solicitud) return;
    if (modalType === 'delete' && !rejectReason.trim()) {
      setInputError(true);
      return;
    }

    switch (solicitud.tipo) {
      case 'Crear Equipo': {
        if (modalType === 'update') {
          const aceptacionData: solicitudCrearEquipo = {
            ...(solicitud as solicitudCrearEquipo),
            id: selectedId,
            estado: 'aceptada',
            fechaRespuestaAdmin: new Date().toISOString(),
            admin: {
              id: user!.uid,
              nombre: user!.nombre,
              apellidos: user!.apellidos,
              correo: user!.correo,
            },
          };
          const res = await aceptarCrearEquipoSolicitud(
            temporada!.id,
            aceptacionData
          );
          showToast(
            res.success ? 'Solicitud aceptada' : 'Error al aceptar solicitud',
            res.success ? 'success' : 'error'
          );
        } else {
          const rechazoData: solicitudCrearEquipo = {
            ...(solicitud as solicitudCrearEquipo),
            id: selectedId,
            estado: 'rechazada',
            respuestaAdmin: rejectReason,
            fechaRespuestaAdmin: new Date().toISOString(),
            admin: {
              id: user!.uid,
              nombre: user!.nombre,
              apellidos: user!.apellidos,
              correo: user!.correo,
            },
          };
          const res = await rechazarCrearEquipoSolicitud(
            temporada!.id,
            rechazoData
          );
          showToast(
            res.success ? 'Solicitud rechazada' : 'Error al rechazar solicitud',
            res.success ? 'warning' : 'error'
          );
        }
        break;
      }
      case 'Unirse a Equipo': {
        console.log('Unirse a Equipo - ', user);
        const solicitudUE = solicitud as solicitudUnirseEquipo;

        if (user?.role === 'jugador' && modalType === 'update') {
          console.log('Jugador - ', user);
          const dorsal = parseInt(dorsalInput.trim(), 10);
          const isDorsalValid =
            !isNaN(dorsal) && !dorsalesOcupados.includes(dorsal);
          console.log('isDorsalValid - ', isDorsalValid);
          if (!isDorsalValid) {
            setInputError(true);
            return;
          } else {
            setInputError(false);
            solicitudUE.jugadorObjetivo.dorsal = dorsal;
          }
        }
        if (modalType === 'update') {
          const res = await aceptarUnirseEquipoSolicitud(
            temporada!.id,
            solicitudUE,
            user!
          );
          showToast(
            res.success ? 'Solicitud aceptada' : 'Error al aceptar solicitud',
            res.success ? 'success' : 'error'
          );
        } else {
          const res = await rechazarUnirseEquipoSolicitud(
            temporada!.id,
            solicitud as solicitudUnirseEquipo,
            user!,
            rejectReason
          );
          showToast(
            res.success ? 'Solicitud rechazada' : 'Error al rechazar solicitud',
            res.success ? 'warning' : 'error'
          );
        }
        break;
      }
    }

    const res = await BaseSolicitudService.getSolicitudes(temporada!.id);
    if (res.success && res.data) setSolicitudes(res.data);
    setModalVisible(false);
    setRejectReason('');
    setSelectedId(null);
    setDorsalInput('');
    setDorsalesOcupados([]);
  };

  const renderDorsalInput = () => {
    const solicitud = solicitudes.find((s) => s.id === selectedId);
    if (
      modalType === 'update' &&
      solicitud?.tipo === 'Unirse a Equipo' &&
      (solicitud as solicitudUnirseEquipo).jugadorObjetivo.id === user?.uid
    ) {
      return (
        <View style={{ gap: 8 }}>
          <StyledText style={{ fontWeight: 'bold' }}>
            Dorsales ocupados: {dorsalesOcupados.join(', ')}
          </StyledText>
          <StyledTextInput
            placeholder='Introduce el dorsal deseado'
            keyboardType='numeric'
            value={dorsalInput}
            onChangeText={setDorsalInput}
            error={inputError}
          />
          {inputError && (
            <StyledText variant='error'>
              El dorsal no puede estar vacío y deber ser un dorsal libre
            </StyledText>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, marginTop: 8 }}>
      {!isAdmin && (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: theme.border.primary,
            justifyContent: 'center',
            gap: 8,
          }}
          onPress={() => router.push('/nuevaSolicitud')}
        >
          <AddIcon color={theme.text.primary} size={24} />
          <StyledText>Nueva Solicitud</StyledText>
        </TouchableOpacity>
      )}

      <SolicitudesList
        solicitudes={solicitudes}
        esAdmin={isAdmin}
        onAceptar={openAcceptModal}
        onRechazar={openRejectModal}
      />

      <BaseConfirmationModal
        visible={modalVisible}
        type={modalType}
        title={
          modalType === 'update'
            ? '¿Confirmar aceptación?'
            : '¿Motivo de rechazo?'
        }
        confirmLabel={modalType === 'update' ? 'Aceptar' : 'Rechazar'}
        cancelLabel='Cancelar'
        onCancel={() => {
          setModalVisible(false);
          setRejectReason('');
        }}
        onConfirm={handleConfirm}
      >
        {modalType === 'delete' && (
          <>
            <StyledTextInput
              multiline
              placeholder='Introduce el motivo de rechazo'
              value={rejectReason}
              onChangeText={setRejectReason}
              error={inputError}
            />
            {inputError && (
              <StyledText variant='error'>Este campo es obligatorio</StyledText>
            )}
          </>
        )}
        {renderDorsalInput()}
      </BaseConfirmationModal>
    </View>
  );
}
