import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EstadisticaBoton from './EstadisticasBoton';
import { EstadisticasJugador } from '../../../types/estadisticas/jugador';
import { EstadisticasTiro } from '../../../types/estadisticas/tiro';
import { ActualizarEstadisticaJugadorParams } from '../../../screens/modoMesa/ModoMesaLayout';

// Types

interface MesaJugadoresProps {
  equipo: 'local' | 'visitante';
  estadisticasJugadores: Record<string, EstadisticasJugador>;
  onActualizarEstadisticasJugadores: (
    params: ActualizarEstadisticaJugadorParams
  ) => void;
  tiempoMuertoIniciado: boolean;
  cuartoIniciado: boolean;
}

const MesaJugadores: React.FC<MesaJugadoresProps> = ({
  equipo,
  estadisticasJugadores,
  onActualizarEstadisticasJugadores,
  tiempoMuertoIniciado,
  cuartoIniciado,
}) => {
  // Get first 5 players (starting lineup)
  const jugadoresActivos = Object.values(estadisticasJugadores).slice(0, 5);

  // Determine if buttons should be disabled
  console.log('cuartoIniciado?: ', cuartoIniciado);
  console.log('tiempoMuertoIniciado?: ', tiempoMuertoIniciado);

  const botonesDeshabilitados = !cuartoIniciado || tiempoMuertoIniciado;
  console.log('BOTONES DESHABILITADOS?: ', botonesDeshabilitados);
  const handleActualizarEstadistica = (
    jugadorId: string,
    accion: ActualizarEstadisticaJugadorParams['accion'],
    valor: number,
    tipoTiro?: 'anotados' | 'fallados'
  ) => {
    onActualizarEstadisticasJugadores({
      jugadorId,
      equipo,
      accion,
      valor,
      tipoTiro,
    });
  };

  // Calculate total attempts for a shot type
  const calcularIntentos = (tiro: EstadisticasTiro) => {
    return tiro.anotados + tiro.fallados;
  };

  const renderJugador = (jugador: EstadisticasJugador, index: number) => {
    return (
      <View
        key={jugador.jugadorId}
        style={[
          styles.jugadorContainer,
          {
            flexDirection: equipo === 'local' ? 'row' : 'row-reverse',
          },
          index < 4 && styles.borderBottom,
        ]}
      >
        {/* Información del jugador (15-20% del ancho) */}
        <View style={styles.infoSection}>
          <Image source={{ uri: jugador.fotoUrl }} style={styles.foto} />
          <View style={styles.infoTexto}>
            <Text style={styles.nombre} numberOfLines={1}>
              {jugador.nombre}
            </Text>
            <Text style={styles.apellidos} numberOfLines={1}>
              {jugador.apellidos}
            </Text>
            <Text style={styles.dorsal}>#{jugador.dorsal}</Text>
            <Text style={styles.puntos}>{jugador.puntos} pts</Text>
          </View>
        </View>

        {/* Botones de estadísticas (80-85% del ancho) */}
        <View
          style={[
            styles.botonesSection,
            {
              flexDirection: equipo === 'local' ? 'row' : 'row-reverse',
            },
          ]}
        >
          {/* Área de tiros */}
          <View style={styles.tirosArea}>
            {/* Fila de tiros anotados (+1) */}
            <View style={styles.filaTiros}>
              <View style={styles.celdaTiro}>
                <EstadisticaBoton
                  backgroundColor='#28a745'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      'tirosLibres',
                      1,
                      'anotados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>TL +1</Text>
                  <Text style={styles.estadTiro}>
                    {jugador.tirosLibres.anotados}/
                    {calcularIntentos(jugador.tirosLibres)}
                  </Text>
                </EstadisticaBoton>
              </View>

              <View style={styles.celdaTiro}>
                <EstadisticaBoton
                  backgroundColor='#28a745'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      'tirosDos',
                      1,
                      'anotados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>T2 +1</Text>
                  <Text style={styles.estadTiro}>
                    {jugador.tirosDos.anotados}/
                    {calcularIntentos(jugador.tirosDos)}
                  </Text>
                </EstadisticaBoton>
              </View>

              <View style={styles.celdaTiro}>
                <EstadisticaBoton
                  backgroundColor='#28a745'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      'tirosTres',
                      1,
                      'anotados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>T3 +1</Text>
                  <Text style={styles.estadTiro}>
                    {jugador.tirosTres.anotados}/
                    {calcularIntentos(jugador.tirosTres)}
                  </Text>
                </EstadisticaBoton>
              </View>
            </View>

            {/* Fila de tiros fallados (-1) */}
            <View style={styles.filaTiros}>
              <View style={styles.celdaTiro}>
                <EstadisticaBoton
                  backgroundColor='#dc3545'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      'tirosLibres',
                      1,
                      'fallados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>TL -1</Text>
                </EstadisticaBoton>
              </View>

              <View style={styles.celdaTiro}>
                <EstadisticaBoton
                  backgroundColor='#dc3545'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      'tirosDos',
                      1,
                      'fallados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>T2 -1</Text>
                </EstadisticaBoton>
              </View>

              <View style={styles.celdaTiro}>
                <EstadisticaBoton
                  backgroundColor='#dc3545'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      'tirosTres',
                      1,
                      'fallados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>T3 -1</Text>
                </EstadisticaBoton>
              </View>
            </View>
          </View>

          {/* Estadísticas normales */}
          <View style={styles.estadisticasNormales}>
            <View style={styles.celdaEstadistica}>
              <EstadisticaBoton
                backgroundColor='#ffc107'
                onPress={() =>
                  handleActualizarEstadistica(
                    jugador.jugadorId,
                    'faltasCometidas',
                    1
                  )
                }
                disabled={botonesDeshabilitados}
              >
                <Text style={styles.textoEstadistica}>FALTA</Text>
                <Text style={styles.numeroEstadistica}>
                  {jugador.faltasCometidas}
                </Text>
              </EstadisticaBoton>
            </View>

            <View style={styles.celdaEstadistica}>
              <EstadisticaBoton
                backgroundColor='#17a2b8'
                onPress={() =>
                  handleActualizarEstadistica(jugador.jugadorId, 'rebotes', 1)
                }
                disabled={botonesDeshabilitados}
              >
                <Text style={styles.textoEstadistica}>REBOTE</Text>
                <Text style={styles.numeroEstadistica}>{jugador.rebotes}</Text>
              </EstadisticaBoton>
            </View>

            <View style={styles.celdaEstadistica}>
              <EstadisticaBoton
                backgroundColor='#6f42c1'
                onPress={() =>
                  handleActualizarEstadistica(
                    jugador.jugadorId,
                    'asistencias',
                    1
                  )
                }
                disabled={botonesDeshabilitados}
              >
                <Text style={styles.textoEstadistica}>ASIST</Text>
                <Text style={styles.numeroEstadistica}>
                  {jugador.asistencias}
                </Text>
              </EstadisticaBoton>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      {jugadoresActivos.map((jugador, index) => renderJugador(jugador, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  jugadorContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },

  // Información del jugador (15-20% del ancho)
  infoSection: {
    width: '18%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  foto: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 2,
  },
  infoTexto: {
    alignItems: 'center',
    width: '100%',
  },
  nombre: {
    fontSize: 9,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  apellidos: {
    fontSize: 9,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  dorsal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 1,
  },
  puntos: {
    fontSize: 9,
    color: '#6c757d',
    marginTop: 1,
  },

  // Botones de estadísticas (80-85% del ancho)
  botonesSection: {
    width: '82%',
    flexDirection: 'row',
    padding: 2,
  },

  // Área de tiros
  tirosArea: {
    flex: 1,
    marginRight: 2,
  },
  filaTiros: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 2,
  },
  celdaTiro: {
    flex: 1,
    marginHorizontal: 1,
    height: '100%',
  },
  textoTiro: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  estadTiro: {
    color: '#ffffff',
    fontSize: 8,
    marginTop: 1,
  },

  // Estadísticas normales
  estadisticasNormales: {
    width: 70,
    marginLeft: 2,
  },
  celdaEstadistica: {
    flex: 1,
    marginBottom: 2,
    height: '32%',
  },
  textoEstadistica: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600',
  },
  numeroEstadistica: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 1,
  },
});

export default MesaJugadores;
