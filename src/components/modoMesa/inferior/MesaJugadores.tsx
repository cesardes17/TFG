import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ActualizarEstadisticaJugadorParams,
  EstadisticasJugador,
} from '../../../types/estadisticas/jugador';
import { EstadisticasTiro } from '../../../types/estadisticas/tiro';
import RenderEstadisticaJugador from './RenderEstadisticaJugador';
import SeleccionarJugadoresModal from './SeleccionarJugadoresModal';
import StyledButton from '../../common/StyledButton';
import StyledAlert from '../../common/StyledAlert';

interface MesaJugadoresProps {
  equipo: 'local' | 'visitante';
  estadisticasJugadores: Record<string, EstadisticasJugador>;
  onActualizarEstadisticasJugadores: (
    params: ActualizarEstadisticaJugadorParams
  ) => void;
  tiempoMuertoIniciado: boolean;
  cuartoIniciado: boolean;
  setQuintetosListos: (equipo: 'local' | 'visitante', listo: boolean) => void;
  cuartoActual: string;
  setJugadorExpulsadoPendiente: (
    equipo: 'local' | 'visitante',
    pendiente: boolean
  ) => void;
  jugadorExpulsadoPendiente: boolean;
  deshabilitarEstadisticas: boolean;
}

const MesaJugadores: React.FC<MesaJugadoresProps> = ({
  equipo,
  estadisticasJugadores,
  onActualizarEstadisticasJugadores,
  tiempoMuertoIniciado,
  cuartoIniciado,
  setQuintetosListos,
  cuartoActual,
  setJugadorExpulsadoPendiente,
  jugadorExpulsadoPendiente,
  deshabilitarEstadisticas,
}) => {
  const [jugadoresEnPista, setJugadoresEnPista] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [expulsadoAnterior, setExpulsadoAnterior] = useState(false);

  const botonesDeshabilitados = deshabilitarEstadisticas;
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

  const handleAbrirModal = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleConfirmarSeleccion = (ids: string[]) => {
    setJugadoresEnPista(ids);
    setQuintetosListos(equipo, true);
    setMostrarModal(false);
  };

  // 🔍 Detectar si hay algún jugador expulsado en pista y solo notificar si cambia
  useEffect(() => {
    const expulsado = jugadoresEnPista.some((id) => {
      const jugador = estadisticasJugadores[id];
      return jugador && jugador.faltasCometidas >= 5;
    });

    if (expulsado !== expulsadoAnterior) {
      setJugadorExpulsadoPendiente(equipo, expulsado);
      setExpulsadoAnterior(expulsado);
    }
  }, [
    jugadoresEnPista,
    estadisticasJugadores,
    equipo,
    expulsadoAnterior,
    setJugadorExpulsadoPendiente,
  ]);

  const jugadoresEnPistaList = jugadoresEnPista
    .map((id) => estadisticasJugadores[id])
    .filter(Boolean);

  const jugadoresDisponibles = Object.values(estadisticasJugadores);

  return (
    <View style={styles.container}>
      {jugadoresEnPista.length !== 5 ? (
        <View style={styles.centro}>
          <StyledButton
            title='Seleccionar Quinteto Inicial'
            onPress={handleAbrirModal}
          />
        </View>
      ) : (
        <>
          <View style={{ padding: 4 }}>
            <StyledButton
              title='Cambiar Jugadores'
              onPress={handleAbrirModal}
            />
          </View>
          {cuartoActual !== 'DESCANSO' ? (
            <>
              {jugadoresEnPistaList.map((jugador, index) => (
                <RenderEstadisticaJugador
                  key={jugador.jugadorId}
                  jugador={jugador}
                  equipo={equipo}
                  index={index}
                  botonesDeshabilitados={botonesDeshabilitados}
                  handleActualizarEstadistica={handleActualizarEstadistica}
                  calcularIntentos={calcularIntentos}
                />
              ))}
            </>
          ) : (
            <StyledAlert
              variant='info'
              message='En Descanso no se pueden modificar las estadísticas'
            />
          )}
        </>
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
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default MesaJugadores;
