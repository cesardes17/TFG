import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EstadisticaBoton from './EstadisticasBoton';
import { EstadisticasJugador } from '../../../types/estadisticas/jugador';
import { ActualizarEstadisticaJugadorParams } from '../../../screens/modoMesa/ModoMesaLayout';
import { EstadisticasTiro } from '../../../types/estadisticas/tiro';

interface Props {
  jugador: EstadisticasJugador;
  equipo: 'local' | 'visitante';
  index: number;
  botonesDeshabilitados: boolean;
  handleActualizarEstadistica: (
    jugadorId: string,
    accion: ActualizarEstadisticaJugadorParams['accion'],
    valor: number,
    tipoTiro?: 'anotados' | 'fallados'
  ) => void;
  calcularIntentos: (tiro: EstadisticasTiro) => number;
}

export default function RenderEstadisticaJugador({
  jugador,
  equipo,
  index,
  botonesDeshabilitados,
  handleActualizarEstadistica,
  calcularIntentos,
}: Props) {
  return (
    <View
      style={[
        styles.jugadorContainer,
        {
          flexDirection: equipo === 'local' ? 'row' : 'row-reverse',
        },
        index < 4 && styles.borderBottom,
      ]}
    >
      {/* Info */}
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

      {/* Botones */}
      <View
        style={[
          styles.botonesSection,
          { flexDirection: equipo === 'local' ? 'row' : 'row-reverse' },
        ]}
      >
        {/* Tiros */}
        <View style={styles.tirosArea}>
          <View style={styles.filaTiros}>
            {['tirosLibres', 'tirosDos', 'tirosTres'].map((accion, i) => (
              <View style={styles.celdaTiro} key={i}>
                <EstadisticaBoton
                  backgroundColor='#28a745'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      accion as any,
                      1,
                      'anotados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>
                    {accion === 'tirosLibres'
                      ? 'TL +1'
                      : accion === 'tirosDos'
                      ? 'T2 +1'
                      : 'T3 +1'}
                  </Text>
                  <Text style={styles.estadTiro}>
                    {
                      (
                        jugador[
                          accion as keyof EstadisticasJugador
                        ] as EstadisticasTiro
                      ).anotados
                    }
                    /
                    {calcularIntentos(
                      jugador[
                        accion as keyof EstadisticasJugador
                      ] as EstadisticasTiro
                    )}
                  </Text>
                </EstadisticaBoton>
              </View>
            ))}
          </View>

          <View style={styles.filaTiros}>
            {['tirosLibres', 'tirosDos', 'tirosTres'].map((accion, i) => (
              <View style={styles.celdaTiro} key={i}>
                <EstadisticaBoton
                  backgroundColor='#dc3545'
                  onPress={() =>
                    handleActualizarEstadistica(
                      jugador.jugadorId,
                      accion as any,
                      1,
                      'fallados'
                    )
                  }
                  disabled={botonesDeshabilitados}
                >
                  <Text style={styles.textoTiro}>
                    {accion === 'tirosLibres'
                      ? 'TL -1'
                      : accion === 'tirosDos'
                      ? 'T2 -1'
                      : 'T3 -1'}
                  </Text>
                </EstadisticaBoton>
              </View>
            ))}
          </View>
        </View>

        {/* Estadísticas simples */}
        <View style={styles.estadisticasNormales}>
          {[
            {
              accion: 'faltasCometidas',
              color: '#ffc107',
              label: 'FALTA',
              valor: jugador.faltasCometidas,
            },
            {
              accion: 'rebotes',
              color: '#17a2b8',
              label: 'REBOTE',
              valor: jugador.rebotes,
            },
            {
              accion: 'asistencias',
              color: '#6f42c1',
              label: 'ASIST',
              valor: jugador.asistencias,
            },
          ].map(({ accion, color, label, valor }, i) => (
            <View style={styles.celdaEstadistica} key={i}>
              <EstadisticaBoton
                backgroundColor={color}
                onPress={() =>
                  handleActualizarEstadistica(
                    jugador.jugadorId,
                    accion as any,
                    1
                  )
                }
                disabled={botonesDeshabilitados}
              >
                <Text style={styles.textoEstadistica}>{label}</Text>
                <Text style={styles.numeroEstadistica}>{valor}</Text>
              </EstadisticaBoton>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  jugadorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
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
  infoTexto: { alignItems: 'center', width: '100%' },
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
  dorsal: { fontSize: 11, fontWeight: 'bold', color: '#495057', marginTop: 1 },
  puntos: { fontSize: 9, color: '#6c757d', marginTop: 1 },
  botonesSection: { width: '82%', flexDirection: 'row', padding: 2 },
  tirosArea: { flex: 1, marginRight: 2 },
  filaTiros: { flex: 1, flexDirection: 'row', marginBottom: 2 },
  celdaTiro: { flex: 1, marginHorizontal: 1, height: '100%' },
  textoTiro: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
  estadTiro: { color: '#ffffff', fontSize: 8, marginTop: 1 },
  estadisticasNormales: { width: 70, marginLeft: 2 },
  celdaEstadistica: { flex: 1, marginBottom: 2, height: '32%' },
  textoEstadistica: { color: '#ffffff', fontSize: 9, fontWeight: '600' },
  numeroEstadistica: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 1,
  },
});
