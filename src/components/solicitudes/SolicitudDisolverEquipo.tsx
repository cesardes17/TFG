import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { solicitudDisolverEquipo, Solicitud } from '../../types/Solicitud';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';

interface Props {
  solicitud: solicitudDisolverEquipo;
  usuarioActual: {
    id: string;
    esAdmin?: boolean;
  };
  onAceptar: (solicitud: Solicitud) => void;
  onRechazar: (solicitud: Solicitud) => void;
  marcarLeidoSolicitante: (solicitud: Solicitud) => void;
}

export default function SolicitudDisolverEquipoCard({
  solicitud,
  usuarioActual,
  onAceptar,
  onRechazar,
}: Props) {
  const {
    equipo,
    motivoDisolucion,
    estado,
    fechaCreacion,
    solicitante,
    admin,
    fechaRespuestaAdmin,
    respuestaAdmin,
  } = solicitud;
  const { theme } = useTheme();

  const formatearFecha = (fecha: Date) => format(fecha, 'dd/MM/yy');
  const puedeResponder =
    estado === 'pendiente' && usuarioActual.esAdmin && !fechaRespuestaAdmin;

  const estiloSeccion = (sinBorde = false) => [
    styles.seccion,
    { borderColor: theme.border.primary },
    sinBorde && {
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0,
    },
  ];

  return (
    <View style={[styles.tarjeta, { backgroundColor: theme.cardDefault }]}>
      <View style={styles.cabecera}>
        <View
          style={[
            styles.estadoBadge,
            {
              backgroundColor: theme.background[
                estado === 'pendiente'
                  ? 'warning'
                  : estado === 'aceptada'
                  ? 'success'
                  : 'error'
              ] as string,
            },
          ]}
        >
          <StyledText variant='light' size='small' style={styles.estadoTexto}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </StyledText>
        </View>
        <StyledText
          variant='secondary'
          size='small'
          style={styles.fechaCreacion}
        >
          Disolver equipo
        </StyledText>
        <StyledText
          variant='secondary'
          size='small'
          style={styles.fechaCreacion}
        >
          {formatearFecha(fechaCreacion)}
        </StyledText>
      </View>

      <View style={estiloSeccion()}>
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Equipo a disolver
        </StyledText>
        <View style={styles.infoEquipo}>
          <ProgressiveImage
            uri={equipo.escudoUrl || 'https://via.placeholder.com/40'}
            containerStyle={styles.escudoEquipo}
          />
          <StyledText variant='primary' style={styles.nombreEquipo}>
            {equipo.nombre}
          </StyledText>
        </View>
      </View>

      <View style={estiloSeccion()}>
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Motivo
        </StyledText>
        <StyledText variant='primary'>{motivoDisolucion}</StyledText>
      </View>

      <View style={estiloSeccion(true)}>
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Solicitante
        </StyledText>
        <View style={styles.infoSolicitante}>
          <ProgressiveImage
            uri={solicitante.fotoUrl}
            containerStyle={styles.fotoSolicitante}
          />
          <View style={styles.datosSolicitante}>
            <StyledText variant='primary' style={styles.nombreCompleto}>
              {solicitante.nombre} {solicitante.apellidos}
            </StyledText>
            <StyledText variant='secondary' style={styles.correo}>
              {solicitante.correo}
            </StyledText>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.bloqueAccionesFooter,
          { borderTopColor: theme.border.primary },
        ]}
      >
        {estado === 'pendiente' ? (
          puedeResponder ? (
            <View style={styles.botonesAccion}>
              <TouchableOpacity
                style={[
                  styles.boton,
                  { backgroundColor: theme.button.primary.background },
                ]}
                onPress={() => onAceptar(solicitud)}
              >
                <StyledText variant='light'>Aceptar</StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.boton,
                  { backgroundColor: theme.button.error.background },
                ]}
                onPress={() => onRechazar(solicitud)}
              >
                <StyledText variant='light'>Rechazar</StyledText>
              </TouchableOpacity>
            </View>
          ) : (
            <StyledText variant='secondary' style={styles.esperandoRespuesta}>
              Esperando respuesta
            </StyledText>
          )
        ) : (
          <View
            style={[
              styles.infoResolucion,
              { backgroundColor: theme.background.primary },
            ]}
          >
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
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  estadoTexto: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  fechaCreacion: {
    fontSize: 12,
  },
  seccion: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  tituloSeccion: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoEquipo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  escudoEquipo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  nombreEquipo: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  contenedorIconoEstado: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSolicitante: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fotoSolicitante: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  datosSolicitante: {
    flex: 1,
    marginHorizontal: 12,
  },
  nombreCompleto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  correo: {
    fontSize: 14,
  },
  dorsal: {
    fontSize: 14,
    marginTop: 4,
  },
  bloqueAccionesFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  infoResolucion: {
    padding: 12,
    borderRadius: 8,
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
});
