// src/components/jornadas/MostrarSeries.tsx
import React from 'react';
import { View } from 'react-native';
import LoadingIndicator from '../common/LoadingIndicator';
import StyledAlert from '../common/StyledAlert';
import { Competicion } from '../../types/Competicion';
import { Jornada } from '../../types/Jornada';
import { useSeriesPorJornada } from '../../hooks/useSeriesPorJornadas';
import { TarjetaSerie } from './TarjetaSerie';

interface Props {
  jornada: Jornada;
  competicion: Competicion;
}

export default function MostrarSeries({ jornada, competicion }: Props) {
  const { series, loading, error, fetch } = useSeriesPorJornada(
    jornada,
    competicion
  );

  if (loading) {
    return (
      <View>
        <LoadingIndicator text='Cargando series...' />
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <StyledAlert variant='error' message='Error al cargar las series...' />
      </View>
    );
  }
  console.log('series: ', series);
  return (
    <View>
      {series.length === 0 ? (
        <StyledAlert
          variant='warning'
          message='No hay series para esta ronda ...'
        />
      ) : (
        series.map((serie) => (
          <TarjetaSerie key={serie.id} serie={serie} refetchSerie={fetch} />
        ))
      )}
    </View>
  );
}
