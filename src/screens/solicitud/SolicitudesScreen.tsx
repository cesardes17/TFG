// src/screens/SolicitudesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import StyledTextInput from '../../components/common/StyledTextInput';
import BaseConfirmationModal, {
  ConfirmationType,
} from '../../components/common/BaseConfirmationModal';
import { useTheme } from '../../contexts/ThemeContext';
import { Solicitud } from '../../types/Solicitud';
import { BaseSolicitudService } from '../../services/solicitudesService';
import SolicitudesList from '../../components/solicitudes/SolicitudesList';
import { router } from 'expo-router';
import StyledText from '../../components/common/StyledText';
import { AddIcon } from '../../components/Icons';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useUser } from '../../contexts/UserContext';

export default function SolicitudesScreen() {
  const { theme } = useTheme();
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ConfirmationType>('update');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [inputError, setInputError] = useState(false);

  const isAdmin =
    user?.role === 'coorganizador' || user!.role === 'organizador'; // Asumiendo que el rol 'admin' tiene el valor 'admin' en el objeto user

  useEffect(() => {
    if (!temporada) return;
    BaseSolicitudService.getSolicitudes(temporada.id).then((res) => {
      if (res.success && res.data) setSolicitudes(res.data);
    });
  }, []);

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

    if (modalType === 'update') {
      console.log('Actualizando solicitud...');
    } else {
      const rechazoData: Solicitud = {
        ...solicitud,
        id: selectedId, // Aseguramos que id esté presente
        estado: 'rechazada',
        respuestaAdmin: rejectReason,
        fechaRespuestaAdmin: new Date().toISOString(),
        admin: {
          id: user!.uid,
          nombreCompleto: user!.nombre + ' ' + user!.apellidos,
          correo: user!.correo,
        },
        // Aseguramos que las propiedades requeridas estén presentes
        tipo: solicitud.tipo,
        solicitante: solicitud.solicitante,
        fechaCreacion: solicitud.fechaCreacion,
        nombreEquipo: solicitud.nombreEquipo,
        escudoUrl: solicitud.escudoUrl,
      };

      await BaseSolicitudService.setSolicitud(
        temporada!.id,
        selectedId,
        rechazoData
      );
    }

    // refresca lista y cierra modal
    const res = await BaseSolicitudService.getSolicitudes(temporada!.id);
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
