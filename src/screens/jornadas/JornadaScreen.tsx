import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { Partido } from '../../types/Partido';
import TarjetaPartido from '../../components/jornadas/TarjetaPartido';
import StyledAlert from '../../components/common/StyledAlert';

import { useJornadas } from '../../hooks/useJornadas';
import { usePartidosPorJornada } from '../../hooks/usePartidosPorJornada';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import CarruselJornadas from '../../components/jornadas/CarruselJornadas';

export default function JornadasScreen() {
  const { jornadas, loading: loadingJornadas } = useJornadas();
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<string | null>(
    null
  );
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getPartidos, loading: loadingPartidos } = usePartidosPorJornada();

  // Establecer la jornada inicial (ordenada y primera pendiente)
  useEffect(() => {
    if (jornadas.length > 0) {
      const ordenadas = [...jornadas].sort((a, b) => {
        const numA = parseInt(a.nombre.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.nombre.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });

      const primeraPendiente =
        ordenadas.find((j) => j.estado === 'pendiente') || ordenadas[0];

      setJornadaSeleccionada(primeraPendiente.id);
    }
  }, [jornadas]);

  // Obtener partidos de la jornada seleccionada
  useEffect(() => {
    if (jornadaSeleccionada) {
      getPartidos(jornadaSeleccionada).then((partidos) => {
        setPartidos(partidos);
        setIsLoading(false);
      });
    }
  }, [jornadaSeleccionada]);

  if (loadingJornadas || isLoading) {
    return <LoadingIndicator text='Cargando jornadas...' />;
  }

  return (
    <View>
      <CarruselJornadas
        jornadas={jornadas
          .sort((a, b) => {
            const numA = parseInt(a.nombre.replace(/\D/g, ''), 10) || 0;
            const numB = parseInt(b.nombre.replace(/\D/g, ''), 10) || 0;
            return numA - numB;
          })
          .map((j) => ({ id: j.id, label: j.nombre }))}
        jornadaSeleccionada={jornadaSeleccionada || ''}
        onSeleccionarJornada={setJornadaSeleccionada}
      />
      {loadingPartidos ? (
        <LoadingIndicator text='Cargando partidos...' />
      ) : (
        <View>
          {partidos.length > 0 &&
            partidos.map((partido) => (
              <TarjetaPartido partido={partido} key={partido.id} />
            ))}

          {!loadingPartidos && partidos.length === 0 && (
            <View style={{ paddingHorizontal: 12 }}>
              <StyledAlert
                message='No hay partidos para esta jornada'
                variant='info'
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
