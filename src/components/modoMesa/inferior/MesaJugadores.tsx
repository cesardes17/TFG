import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { EstadisticasJugador } from '../../../types/estadisticas/jugador';
import { EstadisticasTiro } from '../../../types/estadisticas/tiro';
import { ActualizarEstadisticaJugadorParams } from '../../../screens/modoMesa/ModoMesaLayout';
import RenderEstadisticaJugador from './RenderEstadisticaJugador';
import SeleccionarJugadoresModal from './SeleccionarJugadoresModal';

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
  // Estado local para IDs de jugadores en pista
  const [jugadoresEnPista, setJugadoresEnPista] = useState<string[]>([]);

  const botonesDeshabilitados = !cuartoIniciado || tiempoMuertoIniciado;

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

  const calcularIntentos = (tiro: EstadisticasTiro) => {
    return tiro.anotados + tiro.fallados;
  };

  // Estado para mostrar el modal
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleAbrirModal = () => {
    console.log('Mostrar modal');
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleConfirmarSeleccion = (ids: string[]) => {
    console.log('IDs confirmados:', ids);
    setJugadoresEnPista(ids);
    setMostrarModal(false);
  };

  // Lista de jugadores en pista
  const jugadoresEnPistaList = jugadoresEnPista
    .map((id) => estadisticasJugadores[id])
    .filter(Boolean);

  // Lista de todos los jugadores disponibles
  const jugadoresDisponibles = Object.values(estadisticasJugadores);

  return (
    <View style={styles.container}>
      {jugadoresEnPista.length !== 5 ? (
        <Button
          title='Seleccionar Quinteto Inicial'
          onPress={handleAbrirModal}
        />
      ) : (
        jugadoresEnPistaList.map((jugador, index) => (
          <RenderEstadisticaJugador
            key={jugador.jugadorId}
            jugador={jugador}
            equipo={equipo}
            index={index}
            botonesDeshabilitados={botonesDeshabilitados}
            handleActualizarEstadistica={handleActualizarEstadistica}
            calcularIntentos={calcularIntentos}
          />
        ))
      )}

      {mostrarModal && (
        <SeleccionarJugadoresModal
          jugadores={jugadoresDisponibles}
          jugadoresEnPistaIds={jugadoresEnPista}
          onCerrar={handleCerrarModal}
          onConfirmar={handleConfirmarSeleccion}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default MesaJugadores;
