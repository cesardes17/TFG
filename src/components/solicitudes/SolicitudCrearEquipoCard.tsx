// src/components/solicitudes/SolicitudCrearEquipoCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { Solicitud } from '../../types/Solicitud';
import StyledText from '../common/StyledText';
import { ShieldIcon } from '../Icons';

type Props = {
  solicitud: Solicitud;
  esAdmin?: boolean;
  onAceptar?: (id: string) => void;
  onRechazar?: (id: string) => void;
};

export default function SolicitudCrearEquipoCard({
  solicitud,
  esAdmin = false,
  onAceptar,
  onRechazar,
}: Props) {
  const { theme } = useTheme();
  const [estado, setEstado] = useState(solicitud.estado);

  const formatearFecha = (fechaStr: string) =>
    new Date(fechaStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleAceptar = () => {
    onAceptar?.(solicitud.id);
  };
  const handleRechazar = () => {
    onRechazar?.(solicitud.id);
  };
  const getBadgeStyle = () => {
    switch (estado) {
      case 'aceptada':
        return {
          borderColor: theme.border.success,
          backgroundColor: theme.background.success,
        };
      case 'rechazada':
        return {
          borderColor: theme.border.error,
          backgroundColor: theme.background.error,
        };
      default:
        return {
          borderColor: theme.border.warning,
          backgroundColor: theme.background.warning,
        };
    }
  };

  const badgeStyle = getBadgeStyle();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardDefault,
          borderColor: theme.border.primary,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShieldIcon size={24} color={theme.text.primary} />
          <StyledText variant='primary' style={styles.title}>
            {solicitud.tipo}
          </StyledText>
        </View>
        <View style={[styles.badge, badgeStyle]}>
          <StyledText size='small' style={styles.badgeText}>
            {estado.toUpperCase()}
          </StyledText>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.teamRow}>
          <StyledText variant='primary' style={styles.teamName}>
            {solicitud.nombreEquipo}
          </StyledText>
          <Image source={{ uri: solicitud.escudoUrl }} style={styles.escudo} />
        </View>
        <View>
          <StyledText variant='secondary' size='small' style={styles.label}>
            Solicitado por:
          </StyledText>
          <StyledText variant='primary' size='small' style={styles.solicitante}>
            {solicitud.solicitante.nombre +
              ' ' +
              solicitud.solicitante.apellidos}
          </StyledText>
          <StyledText variant='secondary' size='small' style={styles.date}>
            {formatearFecha(solicitud.fechaCreacion)}
          </StyledText>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {esAdmin && estado === 'pendiente' ? (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.rejectButton,
                { backgroundColor: theme.background.error },
              ]}
              onPress={handleRechazar}
            >
              <StyledText style={styles.buttonText}>Rechazar</StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.acceptButton,
                { backgroundColor: theme.background.success },
              ]}
              onPress={handleAceptar}
            >
              <StyledText style={styles.buttonText}>Aceptar</StyledText>
            </TouchableOpacity>
          </View>
        ) : (
          <StyledText
            variant={
              estado === 'pendiente'
                ? 'warning'
                : estado === 'aceptada'
                ? 'success'
                : 'error'
            }
            size='small'
            style={styles.infoText}
          >
            {estado === 'pendiente'
              ? 'Esperando respuesta…'
              : `Solicitud ${
                  estado === 'aceptada' ? 'aceptada' : 'rechazada'
                } por ${
                  solicitud.admin?.nombre + ' ' + solicitud.admin?.nombre
                } el ${
                  solicitud.fechaRespuestaAdmin
                    ? formatearFecha(solicitud.fechaRespuestaAdmin)
                    : ''
                }\n Motivo: ${
                  solicitud.respuestaAdmin
                }\n Para mas información contacta con ${
                  solicitud.admin?.correo
                }`}
          </StyledText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconPlaceholder: { fontSize: 20, marginRight: 8 },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgePending: {
    borderWidth: 1,
  },
  badgeAccepted: {
    borderWidth: 1,
  },
  badgeRejected: {
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  body: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  teamRow: { flexDirection: 'column', alignItems: 'center', marginBottom: 8 },
  escudo: { width: 100, height: 100, borderRadius: 20, marginTop: 12 },
  teamName: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 12, marginBottom: 2 },
  solicitante: { fontSize: 14, marginBottom: 2 },
  date: { fontSize: 12 },

  footer: { marginTop: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  acceptButton: {
    // Remove theme reference from here
    backgroundColor: 'transparent', // Will be overridden in component
  },
  rejectButton: {
    // Remove theme reference from here
    backgroundColor: 'transparent', // Will be overridden in component
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
