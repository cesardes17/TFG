import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';
import { Solicitud, solicitudSalirEquipo } from '../../types/Solicitud';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';
import { CircleCheckIcon, ClockCircleOIcon, CloseCircleoIcon } from '../Icons';
import FooterSolicitudCard from './FooterSolicitudCard';

interface Props {
  solicitud: solicitudSalirEquipo;
  usuarioActual: {
    id: string;
    esAdmin?: boolean;
  };
  onAceptar: (solicitud: Solicitud) => void;
  onRechazar: (solicitud: Solicitud) => void;
  marcarLeidoSolicitante: (solicitud: Solicitud) => void;
}

export default function SolicitudSalirEquipoCard({
  solicitud,
  usuarioActual,
  onAceptar,
  onRechazar,
  marcarLeidoSolicitante,
}: Props) {
  const {
    solicitante,
    equipoActual,
    capitanObjetivo,
    estado,
    fechaCreacion,
    aprobadoCapitan,
    fechaRespuestaCapitan,
    motivoRespuestaCapitan,
    fechaRespuestaAdmin,
    admin,
    respuestaAdmin,
    motivoSalida,
  } = solicitud;
  const { theme } = useTheme();

  const formatearFecha = (fecha: Date) => format(fecha, 'dd/MM/yy');

  const esCapitan = usuarioActual.id === capitanObjetivo.id;
  const esAdmin = usuarioActual.esAdmin === true;

  const quienResponde = fechaRespuestaAdmin
    ? {
        id: admin?.id || '',
        nombre: admin?.nombre || '',
        apellidos: admin?.apellidos || '',
        correo: admin?.correo || '',
      }
    : {
        id: capitanObjetivo.id,
        nombre: capitanObjetivo.nombre,
        apellidos: capitanObjetivo.apellidos,
        correo: capitanObjetivo.correo,
      };

  const puedeResponder =
    estado === 'pendiente' &&
    ((esCapitan && !fechaRespuestaCapitan) ||
      (esAdmin && !fechaRespuestaAdmin));

  const obtenerTextoEstado = () => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'aceptada':
        return 'Aceptada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return 'Desconocido';
    }
  };

  const estiloSeccion = (sinBorde = false) => [
    styles.seccion,
    {
      borderColor: theme.border.primary,
      ...(sinBorde && {
        borderBottomWidth: 0,
        marginBottom: 0,
        paddingBottom: 0,
      }),
    },
  ];

  return (
    <View style={[styles.tarjeta, { backgroundColor: theme.cardDefault }]}>
      <View style={styles.cabecera}>
        <View
          style={[
            styles.estadoBadge,
            {
              backgroundColor:
                theme.background[
                  estado === 'pendiente'
                    ? 'warning'
                    : estado === 'aceptada'
                    ? 'success'
                    : 'error'
                ],
            },
          ]}
        >
          <StyledText variant='light' size='small' style={styles.estadoTexto}>
            {obtenerTextoEstado()}
          </StyledText>
        </View>
        <StyledText
          variant='secondary'
          size='small'
          style={styles.fechaCreacion}
        >
          Solicitud de salir del equipo
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
          Capitán (Afectado)
        </StyledText>
        <View style={styles.infoJugador}>
          <ProgressiveImage
            uri={capitanObjetivo.fotoUrl || 'https://via.placeholder.com/50'}
            containerStyle={styles.fotoJugador}
          />
          <View style={styles.datosJugador}>
            <StyledText variant='primary' style={styles.nombreCompleto}>
              {capitanObjetivo.nombre} {capitanObjetivo.apellidos}
            </StyledText>
            <StyledText variant='secondary' style={styles.correo}>
              {capitanObjetivo.correo}
            </StyledText>
          </View>
          <View style={styles.contenedorIconoEstado}>
            {aprobadoCapitan === true ? (
              <CircleCheckIcon size={24} color={theme.background.success} />
            ) : aprobadoCapitan === false ? (
              <CloseCircleoIcon size={24} color={theme.background.error} />
            ) : estado === 'pendiente' ? (
              <ClockCircleOIcon size={24} color={theme.background.warning} />
            ) : null}
          </View>
        </View>
      </View>

      <View style={estiloSeccion()}>
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Información
        </StyledText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <StyledText variant='secondary'>Solicitante</StyledText>
            <View style={styles.infoJugador}>
              <ProgressiveImage
                uri={solicitante.fotoUrl || 'https://via.placeholder.com/40'}
                containerStyle={styles.fotoJugador}
              />
              <View style={styles.datosJugador}>
                <StyledText variant='primary' style={styles.nombreCompleto}>
                  {solicitante.nombre} {solicitante.apellidos}
                </StyledText>
                <StyledText variant='secondary' style={styles.correo}>
                  {solicitante.correo}
                </StyledText>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <StyledText variant='secondary'>Equipo actual</StyledText>
            <View style={styles.infoEquipo}>
              <ProgressiveImage
                uri={equipoActual.escudoUrl || 'https://via.placeholder.com/40'}
                containerStyle={styles.escudoEquipo}
              />
              <StyledText variant='primary' style={styles.nombreEquipo}>
                {equipoActual.nombre}
              </StyledText>
            </View>
          </View>
        </View>
      </View>

      <View style={estiloSeccion(true)}>
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Motivo
        </StyledText>
        <StyledText variant='primary'>{motivoSalida}</StyledText>
      </View>

      <FooterSolicitudCard
        estado={estado}
        afectadoId={capitanObjetivo.id}
        solicitanteId={solicitante.id}
        vistoPorSolicitante={solicitud.vistoSolicitante}
        vistoPorAfectado={solicitud.vistoAfectado}
        puedeResponder={puedeResponder}
        onAceptar={() => onAceptar(solicitud)}
        onRechazar={() => onRechazar(solicitud)}
        admin={quienResponde}
        fechaRespuestaAdmin={fechaRespuestaAdmin || fechaRespuestaCapitan}
        respuestaAdmin={respuestaAdmin || motivoRespuestaCapitan}
        onMarcarComoLeido={() => marcarLeidoSolicitante(solicitud)}
      />
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
  infoJugador: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fotoJugador: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  datosJugador: {
    flex: 1,
    marginHorizontal: 12,
  },
  contenedorIconoEstado: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  infoSolicitante: {},
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
    color: '#666',
    fontStyle: 'italic',
  },
  infoResolucion: {
    padding: 12,
    borderRadius: 8,
  },
  textoInfoResolucion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  textoMotivoRechazo: {
    fontSize: 14,
    color: '#F44336',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
