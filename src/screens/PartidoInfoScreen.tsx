import React from 'react';
import { View } from 'react-native';
import { partidoEjemploFinalizado } from '../constants/partidoFinalizado';
import HeaderPartido from '../components/partidos/HeaderPartido';
import EstadisticasComparativas from '../components/partidos/EstadisticasComparativas';

export default function PartidoInfoScreen() {
  const {
    equipoLocal,
    equipoVisitante,
    resultado,
    estado,
    fecha,
    cancha,
    estadisticasEquipos,
  } = partidoEjemploFinalizado;

  return (
    <View style={{ paddingVertical: 16 }}>
      <HeaderPartido
        equipoLocal={equipoLocal}
        equipoVisitante={equipoVisitante}
        resultado={resultado ?? null}
        estado={estado}
        fecha={fecha}
        cancha={cancha}
      />

      {/* Mostrar estadísticas si el partido NO está pendiente */}
      {estado !== 'pendiente' && estadisticasEquipos && (
        <EstadisticasComparativas estadisticas={estadisticasEquipos} />
      )}
    </View>
  );
}
