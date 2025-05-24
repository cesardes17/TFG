import React from 'react';
import { View, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { solicitudDisolverEquipo, Solicitud } from '../../types/Solicitud';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';
import FooterSolicitudCard from './FooterSolicitudCard';

interface Props {
  solicitud: solicitudDisolverEquipo;
  usuarioActual: {
    id: string;
    esAdmin: boolean;
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
  marcarLeidoSolicitante,
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
    vistoSolicitante,
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

      <FooterSolicitudCard
        puedeResponder={puedeResponder}
        estado={estado}
        solicitanteId={solicitante.id}
        fechaRespuestaAdmin={fechaRespuestaAdmin}
        admin={admin}
        respuestaAdmin={respuestaAdmin}
        onAceptar={() => onAceptar(solicitud)}
        onRechazar={() => onRechazar(solicitud)}
        onMarcarComoLeido={() => marcarLeidoSolicitante(solicitud)}
        vistoPorSolicitante={vistoSolicitante}
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
});
