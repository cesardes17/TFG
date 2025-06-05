// src/components/mesa/MesaSuperior.tsx
import { View, StyleSheet } from 'react-native';
import { EstadisticasEquipo } from '../../../types/estadisticas/equipo';
import { EquipoPartido } from '../../../types/Equipo';
import MesaEquipo from './MesaEquipo';
import MesaControlTiempo from './MesaControlTiempo';
import { useEffect } from 'react';

interface MesaSuperiorProps {
  equipoLocal: EquipoPartido;
  equipoVisitante: EquipoPartido;
  estadisticasCuartoActual?: {
    local: EstadisticasEquipo;
    visitante: EstadisticasEquipo;
  };
  puntos: {
    local: number;
    visitante: number;
  };
  cuartoActual: string;
  tiempoActualCuarto: number;
  tiempoMuertoSolicitado: { local: boolean; visitante: boolean };
  tiempoMuertoIniciado: boolean; // 🟢 importante: ahora lo usaremos como "hayTiempoMuertoActivo"
  quintetosListos: { local: boolean; visitante: boolean };
  partidoIniciado: boolean;
  setPartidoIniciado: (iniciado: boolean) => void;
  setTiempoMuertoIniciado: (iniciado: boolean) => void;
  puedeSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => boolean;
  onSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
  onCancelarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
  onFinTiempoMuerto: () => void;
  onFinCuarto: () => void;
  setCuartoIniciado: (iniciado: boolean) => void;
  setCronometroActivo: (activo: boolean) => void;
  jugadorExpulsadoPendiente: { local: boolean; visitante: boolean };
  cronometroActivo: boolean;
  iniciarCronometro: (tiempoInicial: number) => void;
  pausarCronometro: () => void;
}

export default function MesaSuperior({
  equipoLocal,
  equipoVisitante,
  estadisticasCuartoActual,
  cuartoActual,
  tiempoActualCuarto,
  tiempoMuertoSolicitado,
  puntos,
  tiempoMuertoIniciado,
  quintetosListos,
  partidoIniciado,
  jugadorExpulsadoPendiente,
  cronometroActivo,
  setPartidoIniciado,
  setTiempoMuertoIniciado,
  puedeSolicitarTiempoMuerto,
  onSolicitarTiempoMuerto,
  onCancelarTiempoMuerto,
  onFinTiempoMuerto,
  onFinCuarto,
  setCuartoIniciado,
  setCronometroActivo,
  iniciarCronometro,
  pausarCronometro,
}: MesaSuperiorProps) {
  const faltasCometidasLocal =
    estadisticasCuartoActual?.local.faltasCometidas ?? 0;
  const faltasCometidasVisitante =
    estadisticasCuartoActual?.visitante.faltasCometidas ?? 0;

  useEffect(() => {
    if (tiempoMuertoSolicitado.local) {
      console.log('Cancelando tiempo muerto solicitado, local');
      onSolicitarTiempoMuerto('local');
    }
    if (tiempoMuertoSolicitado.visitante) {
      console.log('Cancelando tiempo muerto solicitado, visitante');
      onSolicitarTiempoMuerto('visitante');
    }
  }, [cuartoActual]);

  return (
    <View style={styles.container}>
      <View style={styles.tercio}>
        <MesaEquipo
          equipo={equipoLocal}
          puntos={puntos.local}
          faltasCometidas={faltasCometidasLocal}
          puedeSolicitarTiempoMuerto={puedeSolicitarTiempoMuerto}
          tiempoMuertoSolicitado={tiempoMuertoSolicitado.local}
          tiempoMuertoIniciado={tiempoMuertoIniciado}
          tipo='local'
          onSolicitarTiempoMuerto={onSolicitarTiempoMuerto}
          onCancelarTiempoMuerto={onCancelarTiempoMuerto}
          cuartoActual={cuartoActual}
        />
      </View>

      <View style={styles.tercio}>
        <MesaControlTiempo
          cronometroActivo={cronometroActivo}
          tiempoActualCuarto={tiempoActualCuarto}
          iniciarCronometro={iniciarCronometro}
          pausarCronometro={pausarCronometro}
          cuartoActual={cuartoActual}
          hayTiempoMuertoActivo={tiempoMuertoIniciado} // 🟢 ahora es la prop correcta
          onFinTiempoMuerto={() => {
            console.log('Fin tiempo muerto');
            setTiempoMuertoIniciado(false);
            onFinTiempoMuerto();
          }}
          onInitTiempoMuerto={() => {
            setTiempoMuertoIniciado(true);
          }}
          onFinCuarto={() => {
            console.log('Fin cuarto');
            onFinCuarto();
          }}
          setCuartoIniciado={setCuartoIniciado}
          partidoIniciado={partidoIniciado}
          setPartidoIniciado={setPartidoIniciado}
          quintetosListos={quintetosListos.local && quintetosListos.visitante}
          jugadorExpulsadoPendiente={
            jugadorExpulsadoPendiente.local ||
            jugadorExpulsadoPendiente.visitante
          }
          setCronometroActivo={setCronometroActivo}
        />
      </View>

      <View style={styles.tercio}>
        <MesaEquipo
          equipo={equipoVisitante}
          puntos={puntos.visitante}
          faltasCometidas={faltasCometidasVisitante}
          puedeSolicitarTiempoMuerto={puedeSolicitarTiempoMuerto}
          tiempoMuertoSolicitado={tiempoMuertoSolicitado.visitante}
          tiempoMuertoIniciado={tiempoMuertoIniciado}
          tipo='visitante'
          onSolicitarTiempoMuerto={onSolicitarTiempoMuerto}
          onCancelarTiempoMuerto={onCancelarTiempoMuerto}
          cuartoActual={cuartoActual}
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
