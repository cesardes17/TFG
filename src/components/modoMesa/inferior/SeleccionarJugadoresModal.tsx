import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { EstadisticasJugador } from '../../../types/estadisticas/jugador';
import StyledText from '../../common/StyledText';

interface SeleccionarJugadoresModalProps {
  jugadores: EstadisticasJugador[];
  jugadoresEnPistaIds: string[];
  onCerrar: () => void;
  onConfirmar: (jugadoresSeleccionados: string[]) => void;
}

export default function SeleccionarJugadoresModal({
  jugadores,
  jugadoresEnPistaIds,
  onCerrar,
  onConfirmar,
}: SeleccionarJugadoresModalProps) {
  const [jugadoresSeleccionados, setJugadoresSeleccionados] =
    useState<string[]>(jugadoresEnPistaIds);

  const screenDimensions = Dimensions.get('window');
  const modalWidth = Math.min(screenDimensions.width * 0.9, 800);
  const modalHeight = Math.min(screenDimensions.height * 0.8, 600);

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
    onConfirmar(jugadoresSeleccionados);
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
            {
              width: modalWidth,
              height: modalHeight,
              backgroundColor: '#1a1a1a',
            },
          ]}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <StyledText variant='light' size={18} style={styles.titulo}>
              Seleccionar Jugadores en Pista
            </StyledText>
            <StyledText variant='secondary' size={12} style={styles.subtitulo}>
              {jugadoresSeleccionados.length}/5 jugadores seleccionados
            </StyledText>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            {filasJugadores.map((fila, filaIndex) => (
              <View key={filaIndex} style={styles.fila}>
                {fila.map((jugador) => {
                  const estaSeleccionado = jugadoresSeleccionados.includes(
                    jugador.jugadorId
                  );
                  const estaExpulsado = jugador.faltasCometidas >= 5;

                  return (
                    <TouchableOpacity
                      key={jugador.jugadorId}
                      style={[
                        styles.tarjetaJugador,
                        {
                          borderColor: estaSeleccionado
                            ? '#3B82F6'
                            : estaExpulsado
                            ? '#DC2626'
                            : '#444',
                          backgroundColor: estaExpulsado
                            ? '#3a1a1a'
                            : estaSeleccionado
                            ? '#224466'
                            : '#222',
                        },
                      ]}
                      onPress={() => toggleJugador(jugador.jugadorId)}
                      activeOpacity={0.7}
                      disabled={estaExpulsado && !estaSeleccionado}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          alignItems: 'flex-end',
                        }}
                      >
                        {estaSeleccionado && (
                          <StyledText
                            size={10}
                            variant='light'
                            style={styles.jugadorSeleccionadoTexto}
                          >
                            Jugador en pista
                          </StyledText>
                        )}
                        {estaExpulsado && (
                          <StyledText
                            size={10}
                            variant='error'
                            style={styles.jugadorExpulsadoTexto}
                          >
                            Jugador expulsado
                          </StyledText>
                        )}
                      </View>

                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <View style={styles.fotoContainer}>
                          {jugador.fotoUrl && (
                            <Image
                              source={{ uri: jugador.fotoUrl }}
                              style={styles.foto}
                            />
                          )}
                        </View>

                        <StyledText
                          size={10}
                          variant='light'
                          style={styles.dorsal}
                        >
                          #{jugador.dorsal}
                        </StyledText>
                        <StyledText
                          size={9}
                          variant='light'
                          style={styles.nombre}
                          numberOfLines={1}
                        >
                          {jugador.nombre}
                        </StyledText>
                        <StyledText
                          size={8}
                          variant='secondary'
                          style={styles.apellidos}
                          numberOfLines={1}
                        >
                          {jugador.apellidos}
                        </StyledText>
                        <StyledText
                          size={11}
                          variant='error'
                          style={styles.faltas}
                          numberOfLines={1}
                        >
                          Faltas: {jugador.faltasCometidas}
                        </StyledText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.boton, { backgroundColor: '#444' }]}
              onPress={onCerrar}
            >
              <StyledText
                variant='secondary'
                size={14}
                style={styles.textoBotonCancelar}
              >
                Cancelar
              </StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.boton,
                {
                  backgroundColor: '#22C55E',
                  opacity: jugadoresSeleccionados.length !== 5 ? 0.5 : 1,
                },
              ]}
              onPress={confirmarSeleccion}
              disabled={jugadoresSeleccionados.length !== 5}
            >
              <StyledText
                variant='light'
                size={14}
                style={styles.textoBotonConfirmar}
              >
                Confirmar selección ({jugadoresSeleccionados.length})
              </StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
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
    fontWeight: 'bold',
  },
  subtitulo: {
    marginTop: 4,
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
  jugadorSeleccionadoTexto: {
    fontWeight: 'bold',
  },
  jugadorExpulsadoTexto: {
    fontWeight: 'bold',
  },
  dorsal: {
    fontWeight: 'bold',
  },
  nombre: {
    fontWeight: '600',
    textAlign: 'center',
  },
  apellidos: {
    textAlign: 'center',
  },
  faltas: {
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  boton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotonCancelar: {
    fontWeight: '600',
  },
  textoBotonConfirmar: {
    fontWeight: '600',
  },
});
