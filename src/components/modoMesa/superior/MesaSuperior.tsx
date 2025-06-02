import { View, StyleSheet } from 'react-native';
import { EstadisticasEquipo } from '../../../types/estadisticas/equipo';
import { EquipoPartido } from '../../../types/Equipo';
import MesaEquipo from './MesaEquipo';
import MesaControlTiempo from './MesaControlTiempo';
import { useState } from 'react';

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
  tiempoMuertoSolicitado: { local: boolean; visitante: boolean };
  tiempoMuertoIniciado: boolean;
  setTiempoMuertoIniciado: (iniciado: boolean) => void;
  puedeSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => boolean; // 👈 Nueva prop
  onSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
  onFinTiempoMuerto: () => void;
  onFinCuarto: () => void;
  setCuartoIniciado: (iniciado: boolean) => void;
}

export default function MesaSuperior({
  equipoLocal,
  equipoVisitante,
  estadisticasCuartoActual,
  cuartoActual,
  tiempoMuertoSolicitado,
  puntos,
  tiempoMuertoIniciado,
  setTiempoMuertoIniciado,
  puedeSolicitarTiempoMuerto,
  onSolicitarTiempoMuerto,
  onFinTiempoMuerto,
  onFinCuarto,
  setCuartoIniciado,
}: MesaSuperiorProps) {
  const tiemposMuertosLocal =
    estadisticasCuartoActual?.local.tiemposMuertos ?? 0;
  const faltasCometidasLocal =
    estadisticasCuartoActual?.local.faltasCometidas ?? 0;
  const faltasCometidasVisitante =
    estadisticasCuartoActual?.visitante.faltasCometidas ?? 0;
  const tiemposMuertosVisitante =
    estadisticasCuartoActual?.visitante.tiemposMuertos ?? 0;

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
          cuartoActual={cuartoActual}
        />
      </View>

      <View style={styles.tercio}>
        <MesaControlTiempo
          cuartoActual={cuartoActual}
          hayTiempoMuertoSolicitado={
            tiempoMuertoSolicitado.local || tiempoMuertoSolicitado.visitante
          }
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
