// MesaInferior.tsx
import { View, StyleSheet } from 'react-native';
import { EstadisticasJugadores } from '../../../types/estadisticas/jugador';
import { ActualizarEstadisticaJugadorParams } from '../../../screens/modoMesa/ModoMesaLayout';
import MesaJugadores from './MesaJugadores';

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
}

export default function MesaInferior({
  estadisticasJugadores,
  onActualizarEstadisticasJugadores,
  tiempoMuertoIniciado,
  cuartoIniciado,
  setQuintetosListos,
  cuartoActual,
  setJugadorExpulsadoPendiente,
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

      {/* <View style={styles.tercio}>
        <MesaHistorial />

      </View> */}
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
