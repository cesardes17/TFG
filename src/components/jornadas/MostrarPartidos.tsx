import { Button, View } from 'react-native';
import { usePartidos } from '../../hooks/usePartidosPorJornada';
import { Competicion } from '../../types/Competicion';
import { Jornada } from '../../types/Jornada';
import LoadingIndicator from '../common/LoadingIndicator';
import StyledAlert from '../common/StyledAlert';
import TarjetaPartido from './TarjetaPartido';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

interface MostrarPartidoProps {
  jornada: Jornada;
  competicion: Competicion;
}
export default function MostrarPartidos({
  jornada,
  competicion,
}: MostrarPartidoProps) {
  const {
    error,
    loading,
    partidos,
    fetch: refetch,
  } = usePartidos(jornada, competicion);

  if (!partidos || !competicion) return;
  if (loading) {
    return (
      <View>
        <LoadingIndicator text='Cargando partidos...' />
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <StyledAlert
          variant='error'
          message='Error al cargar los partidos...'
        />
      </View>
    );
  }

  return (
    <View>
      {partidos.length === 0 ? (
        <StyledAlert
          variant='warning'
          message='No hay partidos para esta jornada ...'
        />
      ) : (
        partidos.map((partido) => (
          <TarjetaPartido
            key={partido.id}
            partido={partido}
            reftechPartidos={refetch}
          />
        ))
      )}
    </View>
  );
}
