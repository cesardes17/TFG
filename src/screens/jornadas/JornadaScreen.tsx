// src/screens/JornadasScreen.tsx
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { Partido } from '../../types/Partido';
import CarruselJornadas from '../../components/jornadas/CarruselJornadas';
import TarjetaPartido from '../../components/jornadas/TarjetaPartido';
import StyledAlert from '../../components/common/StyledAlert';

import { useJornadas } from '../../hooks/useJornadas';
import { usePartidosPorJornada } from '../../hooks/usePartidosPorJornada';
import LoadingIndicator from '../../components/common/LoadingIndicator';

export default function JornadasScreen() {
  const { jornadas, loading: loadingJornadas } = useJornadas();
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    partidosPorJornada,
    obtenerPartidosSiNoExisten,
    loading: loadingPartidos,
  } = usePartidosPorJornada();

  // Establecer jornada inicial
  useEffect(() => {
    if (!jornadaSeleccionada && jornadas.length > 0) {
      setJornadaSeleccionada(jornadas[0].id);
    }
  }, [jornadas]);

  // Obtener partidos si no existen en cache
  useEffect(() => {
    if (jornadaSeleccionada) {
      obtenerPartidosSiNoExisten(jornadaSeleccionada);
    }
  }, [jornadaSeleccionada]);

  const partidos: Partido[] = jornadaSeleccionada
    ? partidosPorJornada[jornadaSeleccionada] || []
    : [];

  if (loadingJornadas || loadingPartidos || isLoading) {
    return <LoadingIndicator text='Cargando jornadas...' />;
  }

  return (
    <View>
      <CarruselJornadas
        jornadas={jornadas.map((j) => ({ id: j.id, label: j.nombre }))}
        jornadaSeleccionada={jornadaSeleccionada || ''}
        onSeleccionarJornada={setJornadaSeleccionada}
      />

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
    </View>
  );
}
