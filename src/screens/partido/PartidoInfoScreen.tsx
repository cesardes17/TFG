import React from 'react';
import { View } from 'react-native';
import HeaderPartido from '../../components/partidos/HeaderPartido';
import BodyPartido from '../../components/partidos/BodyPartido';
import AccionesPartido from '../../components/partidos/AccionesPartido';
import { TipoCompeticion } from '../../types/Competicion';
import usePartidoInfo from '../../hooks/usePartidoInfo';
import { Partido, PartidoRT } from '../../types/Partido';

export default function PartidoInfoScreen({
  idPartido,
  tipoCompeticion,
}: {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}) {
  const { partido, cuartoActual, minutoActual, isLoading, error } =
    usePartidoInfo(idPartido, tipoCompeticion);

  // Si el partido no existe aún o está cargando
  if (isLoading || !partido) return null;

  // El partido puede ser de tipo Partido o PartidoRT
  const partidoRender: Partido | PartidoRT = partido;

  return (
    <View style={{ paddingVertical: 16 }}>
      <HeaderPartido
        equipoLocal={partidoRender.equipoLocal}
        equipoVisitante={partidoRender.equipoVisitante}
        resultado={partido.resultado ?? null}
        estado={partidoRender.estado}
        fecha={partidoRender.fecha ?? null}
        cancha={partidoRender.cancha}
        cuartoActual={cuartoActual}
        minutoActual={minutoActual}
        estadisticasEquipo={partidoRender.estadisticasEquipos || null}
      />
      {partidoRender.estado !== 'finalizado' && (
        <AccionesPartido
          partidoId={idPartido}
          tipoCompeticion={tipoCompeticion}
        />
      )}
      <BodyPartido
        estadisticasEquipos={partidoRender.estadisticasEquipos || null}
        estadisticasJugadores={partidoRender.estadisticasJugadores || null}
        estado={partidoRender.estado}
        // aquí también podrías pasar `cuartoActual` y `minutoActual` si lo necesitas en el Body
      />
    </View>
  );
}
