import { View } from 'react-native';
import { useJornadas } from '../../hooks/useJornadas';
import LoadingIndicator from '../common/LoadingIndicator';
import StyledAlert from '../common/StyledAlert';
import CarruselJornadas, { JornadaSelectable } from './CarruselJornadas';
import { Jornada } from '../../types/Jornada';
import { useEffect, useState } from 'react';

import { Competicion } from '../../types/Competicion';
import MostrarPartidos from './MostrarPartidos';

interface BodyJornadasProps {
  competicion: Competicion;
}

export default function BodyJornadas({ competicion }: BodyJornadasProps) {
  const { error, loading, jornadas } = useJornadas(competicion);

  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<Jornada>();
  const jornadasSelectable: JornadaSelectable[] = jornadas.map((jornada) => {
    return {
      id: jornada.id,
      label: jornada.nombre,
    };
  });

  useEffect(() => {
    if (!jornadas) {
      return;
    }
    if (jornadas.length > 0) {
      const jornadaActual = jornadas.find(
        (jornada) => jornada.estado === 'pendiente'
      );
      setJornadaSeleccionada(jornadaActual || jornadas[0]);
    }
  }, [jornadas]);

  if (loading || !jornadaSeleccionada) {
    return (
      <View>
        <LoadingIndicator text='Cargando jornadas...' />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <StyledAlert
          variant='error'
          message='Error al obtener las jornadas...'
        />
      </View>
    );
  }

  return (
    <View>
      <CarruselJornadas
        jornadas={jornadasSelectable}
        jornadaSeleccionada={jornadaSeleccionada.id}
        onSeleccionarJornada={(id) => {
          const jornada = jornadas.find((jornada) => jornada.id === id);
          setJornadaSeleccionada(jornada);
        }}
      />

      <MostrarPartidos
        jornada={jornadaSeleccionada}
        competicion={competicion}
      />
    </View>
  );
}
