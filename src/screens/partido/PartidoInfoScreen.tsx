import React from 'react';
import { View } from 'react-native';
import { partidoEjemploFinalizado } from '../../constants/partidoFinalizado';
import HeaderPartido from '../../components/partidos/HeaderPartido';
import BodyPartido from '../../components/partidos/BodyPartido';
import AccionesPartido from '../../components/partidos/AccionesPartido';
import { TipoCompeticion } from '../../types/Competicion';
import usePartido from '../../hooks/usePartido';

export default function PartidoInfoScreen({
  idPartido,
  tipoCompeticion,
}: {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}) {
  console.log('idPartido', idPartido);
  console.log('tipoCompeticion', tipoCompeticion);
  const { error, isLoading, partido } = usePartido(idPartido, tipoCompeticion);

  const { estado, resultado, estadisticasEquipos, estadisticasJugadores } =
    partidoEjemploFinalizado;

  if (!estadisticasEquipos || !estadisticasJugadores || !partido) {
    return null; // Manejo de caso en el que estadisticasEquipos o estadisticasJugadores son undefined o null
  }

  console.log('partido', partido);

  return (
    <View style={{ paddingVertical: 16 }}>
      <HeaderPartido
        equipoLocal={partido.equipoLocal}
        equipoVisitante={partido.equipoVisitante}
        resultado={partido.resultado}
        estado={partido.estado}
        fecha={partido.fecha}
        cancha={partido.cancha}
      />
      <AccionesPartido
        partidoId={idPartido}
        tipoCompeticion={tipoCompeticion}
      />
      <BodyPartido
        estadisticasEquipos={estadisticasEquipos}
        estadisticasJugadores={estadisticasJugadores}
        estado={estado}
      />
    </View>
  );
}
