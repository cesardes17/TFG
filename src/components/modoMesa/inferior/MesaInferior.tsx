// MesaInferior.tsx
import { View, StyleSheet } from 'react-native';
import { EstadisticasJugadores } from '../../../types/estadisticas/jugador';
import {
  ActualizarEstadisticaJugadorParams,
  HistorialAccion,
} from '../../../screens/modoMesa/ModoMesaLayout';
import MesaJugadores from './MesaJugadores';
import MesaHistorial from './MesaHistorial';

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
