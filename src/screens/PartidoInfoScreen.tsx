import React from 'react';
import { View } from 'react-native';
import { partidoEjemploFinalizado } from '../constants/partidoFinalizado';
import HeaderPartido from '../components/partidos/HeaderPartido';
import EstadisticasComparativas from '../components/partidos/estadisticasComparativas/EstadisticasComparativas';
import BodyPartido from '../components/partidos/BodyPartido';
import StyledButton from '../components/common/StyledButton';
import { useUser } from '../contexts/UserContext';
import AccionesPartido from '../components/partidos/AccionesPartido';

export default function PartidoInfoScreen() {
  const {
    equipoLocal,
    equipoVisitante,
    resultado,
    estado,
    fecha,
    cancha,
    estadisticasEquipos,
    estadisticasJugadores,
  } = partidoEjemploFinalizado;

  if (!estadisticasEquipos || !estadisticasJugadores) {
    return null; // Manejo de caso en el que estadisticasEquipos o estadisticasJugadores son undefined o null
  }
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
      <AccionesPartido />
      <BodyPartido
        estadisticasEquipos={estadisticasEquipos}
        estadisticasJugadores={estadisticasJugadores}
        estado={estado}
      />
    </View>
  );
}
