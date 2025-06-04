import React from 'react';
import { View } from 'react-native';
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
  const { error, isLoading, partido } = usePartido(idPartido, tipoCompeticion);

  if (!partido) {
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
      {partido.estado !== 'finalizado' && (
        <AccionesPartido
          partidoId={idPartido}
          tipoCompeticion={tipoCompeticion}
        />
      )}
      <BodyPartido
        estadisticasEquipos={
          partido.estadisticasEquipos ? partido.estadisticasEquipos : null
        }
        estadisticasJugadores={
          partido.estadisticasJugadores ? partido.estadisticasJugadores : null
        }
        estado={partido.estado}
      />
    </View>
  );
}
