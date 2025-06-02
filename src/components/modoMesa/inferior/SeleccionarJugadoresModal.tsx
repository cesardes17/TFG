import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { EstadisticasJugador } from '../../../types/estadisticas/jugador';

interface SeleccionarJugadoresModalProps {
  jugadores: EstadisticasJugador[];
  jugadoresEnPistaIds: string[];
  onCerrar: () => void;
  onConfirmar: (jugadoresSeleccionados: string[]) => void;
}

const SeleccionarJugadoresModal: React.FC<SeleccionarJugadoresModalProps> = ({
  jugadores,
  jugadoresEnPistaIds,
  onCerrar,
  onConfirmar,
}) => {
  const [jugadoresSeleccionados, setJugadoresSeleccionados] =
    useState<string[]>(jugadoresEnPistaIds);

  const screenDimensions = Dimensions.get('window');
  const modalWidth = Math.min(screenDimensions.width * 0.9, 800);
  const modalHeight = Math.min(screenDimensions.height * 0.8, 600);

  // Calcular layout dinámico
  const layoutConfig = useMemo(() => {
    const totalJugadores = jugadores.length;
    if (totalJugadores === 0) return { filas: 0, jugadoresPorFila: 0 };

    let mejorConfig = { filas: 1, jugadoresPorFila: totalJugadores };
    let menorDiferencia = Infinity;

    for (
      let filas = 1;
      filas <= Math.ceil(Math.sqrt(totalJugadores));
      filas++
    ) {
      const jugadoresPorFila = Math.ceil(totalJugadores / filas);
      const aspectRatio = jugadoresPorFila / filas;
      const diferencia = Math.abs(aspectRatio - 1.8);

      if (diferencia < menorDiferencia) {
        menorDiferencia = diferencia;
        mejorConfig = { filas, jugadoresPorFila };
      }
    }

    return mejorConfig;
  }, [jugadores.length]);

  const filasJugadores = useMemo(() => {
    const filas: EstadisticasJugador[][] = [];
    const { jugadoresPorFila } = layoutConfig;

    for (let i = 0; i < jugadores.length; i += jugadoresPorFila) {
      filas.push(jugadores.slice(i, i + jugadoresPorFila));
    }

    return filas;
  }, [jugadores, layoutConfig]);

  const toggleJugador = (jugadorId: string) => {
    if (jugadoresSeleccionados.includes(jugadorId)) {
      setJugadoresSeleccionados((prev) =>
        prev.filter((id) => id !== jugadorId)
      );
    } else {
      if (jugadoresSeleccionados.length >= 5) {
        Alert.alert(
          'Límite alcanzado',
          'Solo puedes seleccionar un máximo de 5 jugadores en pista.'
        );
        return;
      }
      setJugadoresSeleccionados((prev) => [...prev, jugadorId]);
    }
  };

  const confirmarSeleccion = () => {
    if (jugadoresSeleccionados.length === 0) {
      Alert.alert(
        'Selección requerida',
        'Debes seleccionar al menos un jugador.'
      );
      return;
    }
    onConfirmar(jugadoresSeleccionados);
  };

  const obtenerIniciales = (nombre: string, apellidos: string) => {
    const inicialNombre = nombre.charAt(0).toUpperCase();
    const inicialApellido =
      apellidos.split(' ')[0]?.charAt(0).toUpperCase() || '';
    return inicialNombre + inicialApellido;
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType='fade'
      onRequestClose={onCerrar}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { width: modalWidth, height: modalHeight },
          ]}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Seleccionar Jugadores en Pista</Text>
            <Text style={styles.subtitulo}>
              {jugadoresSeleccionados.length}/5 jugadores seleccionados
            </Text>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            {filasJugadores.map((fila, filaIndex) => (
              <View key={filaIndex} style={styles.fila}>
                {fila.map((jugador) => {
                  const estaSeleccionado = jugadoresSeleccionados.includes(
                    jugador.jugadorId
                  );
                  return (
                    <TouchableOpacity
                      key={jugador.jugadorId}
                      style={[
                        styles.tarjetaJugador,
                        {
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 2,
                          borderRadius: 8,
                          borderColor: estaSeleccionado ? '#4CAF50' : '#E0E0E0',
                          backgroundColor: estaSeleccionado
                            ? '#E8F5E8'
                            : '#FFFFFF',
                        },
                      ]}
                      onPress={() => toggleJugador(jugador.jugadorId)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.fotoContainer}>
                        {jugador.fotoUrl ? (
                          <Image
                            source={{ uri: jugador.fotoUrl }}
                            style={styles.foto}
                          />
                        ) : (
                          <View style={styles.inicialesContainer}>
                            <Text style={styles.iniciales}>
                              {obtenerIniciales(
                                jugador.nombre,
                                jugador.apellidos
                              )}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.dorsal}>#{jugador.dorsal}</Text>
                      <Text style={styles.nombre} numberOfLines={1}>
                        {jugador.nombre}
                      </Text>
                      <Text style={styles.apellidos} numberOfLines={1}>
                        {jugador.apellidos}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.boton, styles.botonCancelar]}
              onPress={onCerrar}
            >
              <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, styles.botonConfirmar]}
              onPress={confirmarSeleccion}
            >
              <Text style={styles.textoBotonConfirmar}>
                Confirmar selección ({jugadoresSeleccionados.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitulo: {
    fontSize: 12,
    color: '#666',
  },
  body: {
    flex: 8,

    gap: 4,
    padding: 16,
  },
  fila: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tarjetaJugador: {
    flex: 1,
    margin: 4,
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
  },
  fotoContainer: {
    marginBottom: 4,
  },
  foto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  inicialesContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iniciales: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dorsal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  nombre: {
    fontSize: 9,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  apellidos: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  boton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#f0f0f0',
  },
  botonConfirmar: {
    backgroundColor: '#4CAF50',
  },
  textoBotonCancelar: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  textoBotonConfirmar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SeleccionarJugadoresModal;
