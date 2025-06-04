// MesaInferior.tsx
import { View, StyleSheet } from 'react-native';
import {
  ActualizarEstadisticaJugadorParams,
  EstadisticasJugadores,
} from '../../../types/estadisticas/jugador';

import MesaJugadores from './MesaJugadores';
import MesaHistorial from './MesaHistorial';
import { HistorialAccion } from '../../../types/HistorialAccion';

interface Props {
  estadisticasJugadores: EstadisticasJugadores;
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
  historialAcciones: HistorialAccion[];
  onEliminarAccion: (idAccion: string) => void;
  cronometroActivo: boolean; // Agregado para el cronometro
}

export default function MesaInferior({
  estadisticasJugadores,
  onActualizarEstadisticasJugadores,
  tiempoMuertoIniciado,
  cuartoIniciado,
  setQuintetosListos,
  cuartoActual,
  setJugadorExpulsadoPendiente,
  historialAcciones,
  onEliminarAccion,
  cronometroActivo,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.tercio}>
        <MesaJugadores
          equipo='local'
          estadisticasJugadores={estadisticasJugadores.local}
          onActualizarEstadisticasJugadores={onActualizarEstadisticasJugadores}
          tiempoMuertoIniciado={tiempoMuertoIniciado}
          cuartoIniciado={cuartoIniciado}
          setQuintetosListos={setQuintetosListos}
          cuartoActual={cuartoActual}
          setJugadorExpulsadoPendiente={setJugadorExpulsadoPendiente}
          cronometroActivo={cronometroActivo}
        />
      </View>

      <View style={styles.tercio}>
        <MesaHistorial
          acciones={historialAcciones}
          onEliminarAccion={onEliminarAccion}
        />
      </View>
      <View style={styles.tercio}>
        <MesaJugadores
          equipo='visitante'
          estadisticasJugadores={estadisticasJugadores.visitante}
          onActualizarEstadisticasJugadores={onActualizarEstadisticasJugadores}
          tiempoMuertoIniciado={tiempoMuertoIniciado}
          cuartoIniciado={cuartoIniciado}
          setQuintetosListos={setQuintetosListos}
          cuartoActual={cuartoActual}
          setJugadorExpulsadoPendiente={setJugadorExpulsadoPendiente}
          cronometroActivo={cronometroActivo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tercio: {
    flex: 1,
    padding: 8,
  },
});
