import React from 'react';
import { View, StyleSheet, TouchableOpacity, Touchable } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import { EnvelopeIcon, EnvelopeOpenIcon } from '../Icons';
import { useUser } from '../../contexts/UserContext';

interface FooterSolicitudCardProps {
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  solicitanteId: string;
  afectadoId?: string;
  fechaRespuestaAdmin?: Date;
  admin?: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
  };
  respuestaAdmin?: string;
  puedeResponder: boolean;
  onAceptar?: () => void;
  onRechazar?: () => void;
  vistoPorSolicitante?: boolean;
  vistoPorAfectado?: boolean;
  onMarcarComoLeido: () => void;
}

export default function FooterSolicitudCard({
  estado,
  solicitanteId,
  fechaRespuestaAdmin,
  admin,
  respuestaAdmin,
  puedeResponder,
  onAceptar,
  onRechazar,
  vistoPorSolicitante,
  onMarcarComoLeido,
  afectadoId,
  vistoPorAfectado,
}: FooterSolicitudCardProps) {
  const { theme } = useTheme();
  const { user } = useUser();

  if (!user) return;

  const usuarioActual = {
    id: user.uid,
    esAdmin: user.rol === 'organizador' || user.rol === 'coorganizador',
    esAfectado: user.uid === afectadoId,
    esSolicitante: user.uid === solicitanteId,
  };

  const formatearFecha = (fecha: Date) => format(fecha, 'dd/MM/yy');

  const IconoVisto = () => {
    return (
      <View style={styles.contenedorIconoEstado}>
        <EnvelopeOpenIcon color={theme.text.primary} />
      </View>
    );
  };

  const IconoPendiente = () => {
    return (
      <TouchableOpacity
        style={styles.contenedorIconoEstado}
        onPress={() => onMarcarComoLeido()}
      >
        <EnvelopeIcon color={theme.text.primary} />
      </TouchableOpacity>
    );
  };

  const Seperador = () => {
    return (
      <View
        style={{
          borderWidth: 1,
          marginVertical: 8,
          borderColor: theme.border.primary,
        }}
      ></View>
    );
  };

  if (estado === 'pendiente') {
    return puedeResponder ? (
      <>
        <Seperador />

        <View style={styles.botonesAccion}>
          <TouchableOpacity
            style={[
              styles.boton,
              { backgroundColor: theme.button.primary.background },
            ]}
            onPress={onAceptar}
          >
            <StyledText variant='light'>Aceptar</StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boton,
              { backgroundColor: theme.button.error.background },
            ]}
            onPress={onRechazar}
          >
            <StyledText variant='light'>Rechazar</StyledText>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <>
        <Seperador />

        <StyledText variant='secondary' style={styles.esperandoRespuesta}>
          Esperando respuesta
        </StyledText>
      </>
    );
  }

  return (
    <>
      <Seperador />

      <View
        style={[
          styles.infoResolucion,
          {
            backgroundColor: theme.background.primary,
            borderTopColor: theme.border.primary,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          {fechaRespuestaAdmin && (
            <StyledText style={styles.textoInfoResolucion}>
              Resuelta el {formatearFecha(fechaRespuestaAdmin)}
            </StyledText>
          )}
          {admin && (
            <StyledText style={styles.textoInfoResolucion}>
              Respondida por {admin.nombre} {admin.apellidos} ({admin.correo})
            </StyledText>
          )}
          {estado === 'rechazada' && respuestaAdmin && (
            <StyledText style={styles.textoMotivoRechazo}>
              Motivo del rechazo: {respuestaAdmin}
            </StyledText>
          )}
        </View>

        {!usuarioActual.esAdmin ? (
          <>
            {usuarioActual.esAfectado && (
              <>
                {vistoPorAfectado ? <IconoVisto /> : <IconoPendiente />}
                <StyledText>Afectado</StyledText>
              </>
            )}
            {usuarioActual.esSolicitante && (
              <>
                {vistoPorSolicitante ? <IconoVisto /> : <IconoPendiente />}
                <StyledText>solicitante</StyledText>
              </>
            )}
          </>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  boton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  esperandoRespuesta: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  infoResolucion: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoInfoResolucion: {
    fontSize: 14,
    marginBottom: 4,
  },
  textoMotivoRechazo: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  contenedorIconoEstado: {
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
