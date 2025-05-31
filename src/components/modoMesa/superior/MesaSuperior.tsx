// MesaSuperior.tsx
import { View, StyleSheet } from 'react-native';
import { EstadisticasEquipo } from '../../../types/estadisticas/equipo';
import { EquipoPartido } from '../../../types/Equipo';
import MesaEquipo from './mesaEquipo';

interface MesaSuperiorProps {
  equipoLocal: EquipoPartido;
  equipoVisitante: EquipoPartido;
  estadisticasCuartoActual?: {
    local: EstadisticasEquipo;
    visitante: EstadisticasEquipo;
  };
  cuartoActual: string;
  onSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
}

export default function MesaSuperior({
  equipoLocal,
  equipoVisitante,
  estadisticasCuartoActual,
  cuartoActual,
  onSolicitarTiempoMuerto,
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
          tiemposMuertos={tiemposMuertosLocal}
          faltasCometidas={faltasCometidasLocal}
          tipo='local'
          onSolicitarTiempoMuerto={onSolicitarTiempoMuerto}
        />
      </View>

      {/* Control de cuarto lo dejamos para después */}
      {/* <View style={styles.tercio}>
        <StyledText>Control Cuarto: {cuartoActual}</StyledText>
      </View> */}

      <View style={styles.tercio}>
        <MesaEquipo
          equipo={equipoVisitante}
          tiemposMuertos={tiemposMuertosVisitante}
          faltasCometidas={faltasCometidasVisitante}
          tipo='visitante'
          onSolicitarTiempoMuerto={onSolicitarTiempoMuerto}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 8, // Espacio entre los elementos
  },
  tercio: {
    flex: 1,
    padding: 8,
  },
});
