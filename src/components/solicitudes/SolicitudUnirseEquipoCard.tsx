import type React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';
import { solicitudUnirseEquipo } from '../../types/Solicitud';

interface Props {
  solicitud: solicitudUnirseEquipo;
  usuarioActual: {
    id: string;
    esAdmin?: boolean;
  };
  onAceptar: (id: string) => void;
  onRechazar: (id: string) => void;
}

const SolicitudEquipo: React.FC<Props> = ({
  solicitud,
  usuarioActual,
  onAceptar,
  onRechazar,
}) => {
  const { theme } = useTheme();
  const {
    jugadorObjetivo,
    equipoObjetivo,
    solicitante,
    estado,
    fechaCreacion,
    fechaRespuestaJugador,
    fechaRespuestaAdmin,
  } = solicitud;

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  // Determinar si el usuario actual puede responder
  const esJugadorObjetivo = usuarioActual.id === jugadorObjetivo.id;
  const esAdmin = usuarioActual.esAdmin === true;

  const puedeResponder =
    estado === 'pendiente' &&
    ((esJugadorObjetivo && !fechaRespuestaJugador) ||
      (esAdmin && !fechaRespuestaAdmin));

  const handleAceptar = () => {
    onAceptar?.(solicitud.id);
  };
  const handleRechazar = () => {
    onRechazar?.(solicitud.id);
  };

  // Obtener color y texto para el estado
  const obtenerColorEstado = () => {
    switch (estado) {
      case 'pendiente':
        return theme.background.warning;
      case 'aceptada':
        return theme.background.success;
      case 'rechazada':
        return theme.background.error;
      default:
        return theme.background.primary;
    }
  };

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

  return (
    <View style={[styles.tarjeta, { backgroundColor: theme.cardDefault }]}>
      {/* Cabecera con estado */}
      <View style={styles.cabecera}>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: obtenerColorEstado() },
          ]}
        >
          <StyledText variant='light' size='small' style={styles.estadoTexto}>
            {obtenerTextoEstado()}
          </StyledText>
        </View>
        <StyledText variant='secondary' size='small'>
          Creada el {formatearFecha(fechaCreacion)}
        </StyledText>
      </View>

      {/* Información del jugador */}
      <View
        style={[styles.seccion, { borderBottomColor: theme.border.secondary }]}
      >
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Jugador
        </StyledText>
        <View style={styles.infoJugador}>
          <ProgressiveImage
            uri={jugadorObjetivo.photoURL || 'https://via.placeholder.com/50'}
            containerStyle={[
              styles.fotoJugador,
              { borderColor: theme.border.primary },
            ]}
            imageStyle={styles.fotoJugador}
          />
          <View style={styles.datosJugador}>
            <StyledText variant='primary' style={styles.nombreCompleto}>
              {jugadorObjetivo.nombre} {jugadorObjetivo.apellidos}
            </StyledText>
            <StyledText variant='secondary' size='small'>
              {jugadorObjetivo.correo}
            </StyledText>
            <StyledText variant='secondary' size='small'>
              Dorsal: {jugadorObjetivo.dorsal}
            </StyledText>
          </View>
        </View>
      </View>

      {/* Información del equipo */}
      <View
        style={[styles.seccion, { borderBottomColor: theme.border.secondary }]}
      >
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Equipo
        </StyledText>
        <View style={styles.infoEquipo}>
          <ProgressiveImage
            uri={equipoObjetivo.escudoUrl || 'https://via.placeholder.com/40'}
            containerStyle={[
              styles.escudoEquipo,
              { borderColor: theme.border.primary },
            ]}
            imageStyle={styles.escudoEquipo}
          />
          <StyledText variant='primary' style={styles.nombreEquipo}>
            {equipoObjetivo.nombre}
          </StyledText>
        </View>
      </View>

      {/* Información del solicitante */}
      <View
        style={[styles.seccion, { borderBottomColor: theme.border.secondary }]}
      >
        <StyledText variant='secondary' style={styles.tituloSeccion}>
          Solicitante
        </StyledText>
        <View style={styles.infoSolicitante}>
          <StyledText variant='primary' style={styles.nombreCompleto}>
            {solicitante.nombre} {solicitante.apellidos}
          </StyledText>
          <StyledText variant='secondary' size='small'>
            {solicitante.correo}
          </StyledText>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.seccionAcciones}>
        {puedeResponder ? (
          <View style={styles.botonesAccion}>
            <TouchableOpacity
              style={[
                styles.boton,
                styles.botonAceptar,
                { backgroundColor: theme.button.primary.background },
              ]}
              onPress={handleAceptar}
            >
              <StyledText variant='light' style={styles.textoBotonAceptar}>
                Aceptar
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.boton,
                styles.botonRechazar,
                { backgroundColor: theme.button.error.background },
              ]}
              onPress={handleRechazar}
            >
              <StyledText variant='light' style={styles.textoBotonRechazar}>
                Rechazar
              </StyledText>
            </TouchableOpacity>
          </View>
        ) : estado === 'pendiente' ? (
          <StyledText variant='secondary' style={styles.esperandoRespuesta}>
            Esperando respuesta
          </StyledText>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: 'white',
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  fechaCreacion: {
    fontSize: 12,
    color: '#666',
  },
  seccion: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tituloSeccion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
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
    marginRight: 12,
  },
  datosJugador: {
    flex: 1,
  },
  nombreCompleto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  correo: {
    fontSize: 14,
    color: '#666',
  },
  dorsal: {
    fontSize: 14,
    color: '#666',
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
  infoSolicitante: {
    // Estilos para la información del solicitante
  },
  seccionAcciones: {
    marginTop: 8,
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
  botonAceptar: {
    backgroundColor: '#4CAF50',
  },
  botonRechazar: {
    backgroundColor: '#F44336',
  },
  textoBotonAceptar: {
    color: 'white',
    fontWeight: 'bold',
  },
  textoBotonRechazar: {
    color: 'white',
    fontWeight: 'bold',
  },
  esperandoRespuesta: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});

export default SolicitudEquipo;
