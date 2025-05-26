import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Solicitud, solicitudUnirseEquipo } from '../../types/Solicitud';
import { CircleCheckIcon, ClockCircleOIcon, CloseCircleoIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';
import FooterSolicitudCard from './FooterSolicitudCard';

interface Props {
  solicitud: solicitudUnirseEquipo;
  usuarioActual: {
    id: string;
    esAdmin?: boolean;
  };
  onAceptar: (solicitud: Solicitud) => void;
  onRechazar: (solicitud: Solicitud) => void;
  marcarLeidoSolicitante: (solicitud: Solicitud) => void;
}

export default function SolicitudUnirseEquipoCard({
  solicitud,
  usuarioActual,
  onAceptar,
  onRechazar,
  marcarLeidoSolicitante,
}: Props) {
  const {
    jugadorObjetivo,
    equipoObjetivo,
    solicitante,
    estado,
    fechaCreacion,
    fechaRespuestaJugador,
    fechaRespuestaAdmin,
    aprobadoJugadorObjetivo,
    motivoRespuestaJugador,
    admin,
    respuestaAdmin,
    vistoSolicitante,
    vistoAfectado,
  } = solicitud;
  const { theme } = useTheme();

  const formatearFecha = (fecha: Date) => format(fecha, 'dd/MM/yy');

  const esJugadorObjetivo = usuarioActual.id === jugadorObjetivo.id;
  const esAdmin = usuarioActual.esAdmin === true;

  const puedeResponder =
    estado === 'pendiente' &&
    ((esJugadorObjetivo && !fechaRespuestaJugador) ||
      (esAdmin && !fechaRespuestaAdmin));

  const quienResponde = fechaRespuestaAdmin
    ? {
        id: admin?.id || '',
        nombre: admin?.nombre || '',
        apellidos: admin?.apellidos || '',
        correo: admin?.correo || '',
      }
    : {
        id: jugadorObjetivo.id,
        nombre: jugadorObjetivo.nombre,
        apellidos: jugadorObjetivo.apellidos,
        correo: jugadorObjetivo.correo,
      };

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
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </StyledText>
        </View>
        <StyledText
          variant='secondary'
          size='small'
          style={styles.fechaCreacion}
        >
          Solicitud de unirse al equipo
        </StyledText>
        <StyledText
          variant='secondary'
          size='small'
          style={styles.fechaCreacion}
        >
          {formatearFecha(fechaCreacion)}
        </StyledText>
      </View>

      {/* Jugador */}
      <View
        style={[
          styles.seccion,
          { borderColor: theme.border.primary, borderBottomWidth: 2 },
        ]}
      >
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Jugador (afectado)
        </StyledText>
        <View style={styles.infoJugador}>
          <ProgressiveImage
            uri={jugadorObjetivo.fotoUrl || 'https://via.placeholder.com/50'}
            containerStyle={styles.fotoJugador}
          />
          <View style={styles.datosJugador}>
            <StyledText variant='primary' style={styles.nombreCompleto}>
              {jugadorObjetivo.nombre} {jugadorObjetivo.apellidos}
            </StyledText>
            <StyledText variant='secondary' style={styles.correo}>
              {jugadorObjetivo.correo}
            </StyledText>
            <StyledText variant='secondary' style={styles.dorsal}>
              Dorsal: {jugadorObjetivo.dorsal}
            </StyledText>
          </View>
          <View style={styles.contenedorIconoEstado}>
            {aprobadoJugadorObjetivo === true ? (
              <CircleCheckIcon size={24} color={theme.background.success} />
            ) : aprobadoJugadorObjetivo === false ? (
              <CloseCircleoIcon size={24} color={theme.background.error} />
            ) : estado === 'pendiente' ? (
              <ClockCircleOIcon size={24} color={theme.background.warning} />
            ) : null}
          </View>
        </View>
      </View>

      {/* Solicitante y equipo */}
      <View style={styles.seccion}>
        <View style={styles.filaDual}>
          <View style={styles.columnaMitad}>
            <StyledText variant='secondary' style={styles.tituloSeccion}>
              Solicitante
            </StyledText>
            <StyledText variant='primary' style={styles.nombreCompleto}>
              {solicitante.nombre} {solicitante.apellidos}
            </StyledText>
            <StyledText variant='secondary' style={styles.correo}>
              {solicitante.correo}
            </StyledText>
          </View>
          <View style={styles.columnaMitad}>
            <StyledText variant='secondary' style={styles.tituloSeccion}>
              Equipo
            </StyledText>
            <View style={styles.infoEquipo}>
              <ProgressiveImage
                uri={
                  equipoObjetivo.escudoUrl || 'https://via.placeholder.com/40'
                }
                containerStyle={styles.escudoEquipo}
              />
              <StyledText variant='primary' style={styles.nombreEquipo}>
                {equipoObjetivo.nombre}
              </StyledText>
            </View>
          </View>
        </View>
      </View>

      {/* Footer común */}
      <FooterSolicitudCard
        estado={estado}
        solicitanteId={solicitante.id}
        vistoPorAfectado={vistoAfectado}
        afectadoId={jugadorObjetivo.id}
        vistoPorSolicitante={vistoSolicitante}
        puedeResponder={puedeResponder}
        onAceptar={() => onAceptar(solicitud)}
        onRechazar={() => onRechazar(solicitud)}
        admin={quienResponde}
        fechaRespuestaAdmin={fechaRespuestaAdmin || fechaRespuestaJugador}
        respuestaAdmin={respuestaAdmin || motivoRespuestaJugador}
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
  filaDual: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  columnaMitad: {
    flex: 1,
  },
});
