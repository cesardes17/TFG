import type React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { solicitudUnirseEquipo } from '../../types/Solicitud';
import { CircleCheckIcon, ClockCircleOIcon, CloseCircleoIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';

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
  } = solicitud;

  const { theme } = useTheme();
  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  const esJugadorObjetivo = usuarioActual.id === jugadorObjetivo.id;
  const esAdmin = usuarioActual.esAdmin === true;

  const puedeResponder =
    estado === 'pendiente' &&
    ((esJugadorObjetivo && !fechaRespuestaJugador) ||
      (esAdmin && !fechaRespuestaAdmin));

  const obtenerColorEstado = () => {
    switch (estado) {
      case 'pendiente':
        return '#FFC107';
      case 'aceptada':
        return '#4CAF50';
      case 'rechazada':
        return '#F44336';
      default:
        return '#9E9E9E';
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

  const estiloSeccion = (sinBorde = false) => [
    styles.seccion,
    sinBorde && {
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0,
    },
  ];

  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: obtenerColorEstado() },
          ]}
        >
          <Text style={styles.estadoTexto}>{obtenerTextoEstado()}</Text>
        </View>
        <Text style={styles.fechaCreacion}>
          Creada el {formatearFecha(fechaCreacion)}
        </Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Jugador</Text>
        <View style={styles.infoJugador}>
          <Image
            source={{
              uri: jugadorObjetivo.photoURL || 'https://via.placeholder.com/50',
            }}
            style={styles.fotoJugador}
          />
          <View style={styles.datosJugador}>
            <Text style={styles.nombreCompleto}>
              {jugadorObjetivo.nombre} {jugadorObjetivo.apellidos}
            </Text>
            <Text style={styles.correo}>{jugadorObjetivo.correo}</Text>
            <Text style={styles.dorsal}>Dorsal: {jugadorObjetivo.dorsal}</Text>
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

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Equipo</Text>
        <View style={styles.infoEquipo}>
          <Image
            source={{
              uri: equipoObjetivo.escudoUrl || 'https://via.placeholder.com/40',
            }}
            style={styles.escudoEquipo}
          />
          <Text style={styles.nombreEquipo}>{equipoObjetivo.nombre}</Text>
        </View>
      </View>

      <View style={estiloSeccion(true)}>
        <Text style={styles.tituloSeccion}>Solicitante</Text>
        <View style={styles.infoSolicitante}>
          <Text style={styles.nombreCompleto}>
            {solicitante.nombre} {solicitante.apellidos}
          </Text>
          <Text style={styles.correo}>{solicitante.correo}</Text>
        </View>
      </View>

      <View style={styles.bloqueAccionesFooter}>
        {estado === 'pendiente' ? (
          puedeResponder ? (
            <View style={styles.botonesAccion}>
              <TouchableOpacity
                style={[styles.boton, styles.botonAceptar]}
                onPress={() => onAceptar(solicitud.id)}
              >
                <Text style={styles.textoBotonAceptar}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonRechazar]}
                onPress={() => onRechazar(solicitud.id)}
              >
                <Text style={styles.textoBotonRechazar}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.esperandoRespuesta}>Esperando respuesta</Text>
          )
        ) : (
          <View style={styles.infoResolucion}>
            {(() => {
              const fechaRespuesta =
                fechaRespuestaAdmin && fechaRespuestaJugador
                  ? new Date(fechaRespuestaAdmin) >
                    new Date(fechaRespuestaJugador)
                    ? fechaRespuestaAdmin
                    : fechaRespuestaJugador
                  : fechaRespuestaAdmin || fechaRespuestaJugador;

              const esRespuestaAdmin =
                fechaRespuestaAdmin &&
                (!fechaRespuestaJugador ||
                  new Date(fechaRespuestaAdmin) >
                    new Date(fechaRespuestaJugador));

              const nombreRespondedor = esRespuestaAdmin
                ? admin
                  ? `${admin.nombre} ${admin.apellidos}`
                  : 'Administrador'
                : `${jugadorObjetivo.nombre} ${jugadorObjetivo.apellidos}`;

              const correoRespondedor = esRespuestaAdmin
                ? admin
                  ? admin.correo
                  : ''
                : jugadorObjetivo.correo;

              return (
                <>
                  {fechaRespuesta && (
                    <Text style={styles.textoInfoResolucion}>
                      Resuelta el {formatearFecha(fechaRespuesta)}
                    </Text>
                  )}
                  <Text style={styles.textoInfoResolucion}>
                    Respondida por {nombreRespondedor} ({correoRespondedor})
                  </Text>
                  {estado === 'rechazada' && motivoRespuestaJugador && (
                    <Text style={styles.textoMotivoRechazo}>
                      Motivo del rechazo: {motivoRespuestaJugador}
                    </Text>
                  )}
                  {estado === 'rechazada' && respuestaAdmin && (
                    <Text style={styles.textoMotivoRechazo}>
                      Motivo del rechazo: {respuestaAdmin}
                    </Text>
                  )}
                </>
              );
            })()}
          </View>
        )}
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
  infoSolicitante: {},
  bloqueAccionesFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
  infoResolucion: {
    padding: 12,
    backgroundColor: '#f9f9f9',
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

export default SolicitudEquipo;
