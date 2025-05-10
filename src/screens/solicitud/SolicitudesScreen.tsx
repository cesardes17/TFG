// src/screens/SolicitudesScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';

import StyledTextInput from '../../components/common/StyledTextInput';
import BaseConfirmationModal, {
  ConfirmationType,
} from '../../components/common/BaseConfirmationModal';
import { useTheme } from '../../contexts/ThemeContext';
import { Solicitud } from '../../types/Solicitud';
import { BaseSolicitudService } from '../../services/solicitudesService';
import SolicitudesList from '../../components/solicitudes/SolicitudesList';
import { router, useFocusEffect } from 'expo-router';
import StyledText from '../../components/common/StyledText';
import { AddIcon } from '../../components/Icons';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../contexts/ToastContext';

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

  const isAdmin =
    user?.role === 'coorganizador' || user!.role === 'organizador'; // Asumiendo que el rol 'admin' tiene el valor 'admin' en el objeto user

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

  const openAcceptModal = (id: string) => {
    setSelectedId(id);
    setModalType('update');
    setModalVisible(true);
  };

  const openRejectModal = (id: string) => {
    setSelectedId(id);
    setModalType('delete'); // 'delete' → usamos input para motivo
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    const solicitud = solicitudes.find((s) => s.id === selectedId);
    if (!selectedId || !solicitud) return;
    if (modalType === 'delete' && !rejectReason.trim()) {
      setInputError(true);
      return;
    }
    console.log('modalType', modalType);
    if (modalType === 'update') {
      const aceptacionData: Solicitud = {
        ...solicitud,
        id: selectedId, // Aseguramos que id esté presente
        estado: 'aceptada',
        fechaRespuestaAdmin: new Date().toISOString(),
        admin: {
          id: user!.uid,
          nombre: user!.nombre,
          apellidos: user!.apellidos,
          correo: user!.correo,
        },
      };
      const res = await BaseSolicitudService.aceptarSolicitud(
        temporada!.id,
        aceptacionData
      );
      if (res.success) {
        showToast('Solicitud aceptada', 'success');
      } else {
        showToast('Error al aceptar solicitud', 'error');
      }
    } else {
      const rechazoData: Solicitud = {
        ...solicitud,
        id: selectedId, // Aseguramos que id esté presente
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

      const res = await BaseSolicitudService.rechazarSolicitud(
        temporada!.id,
        rechazoData
      );

      if (res.success) {
        showToast('Solicitud rechazada', 'success');
      } else {
        showToast('Error al rechazar solicitud', 'error');
      }
    }

    // refresca lista y cierra modal
    const res = await BaseSolicitudService.getSolicitudes(temporada!.id);
    console.log(res.data);
    if (res.success && res.data) setSolicitudes(res.data);
    setModalVisible(false);
    setRejectReason('');
    setSelectedId(null);
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
        onAceptar={(id) => openAcceptModal(id)}
        onRechazar={(id) => openRejectModal(id)}
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
      </BaseConfirmationModal>
    </View>
  );
}
