import { View } from 'react-native';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import usePartidosPorSerie from '../../hooks/usePartidosPorSerie';
import StyledAlert from '../../components/common/StyledAlert';
import TarjetaPartido from '../../components/jornadas/TarjetaPartido';
import StyledText from '../../components/common/StyledText';
import { Stack } from 'expo-router';
import useSerie from '../../hooks/useSerie';

interface SerieInfoScreenProps {
  serieId: string;
}

export default function SerieInfoScreen({ serieId }: SerieInfoScreenProps) {
  const { serie, errorSerie, loadingSeries } = useSerie(serieId);
  const {
    error: errorPartidos,
    partidos,
    partidosLoading,
    fecthPartidos,
  } = usePartidosPorSerie(serieId);

  if (partidosLoading) {
    return (
      <View>
        <LoadingIndicator text='Cargando partidos...' />
      </View>
    );
  }
  if (loadingSeries) {
    return (
      <View>
        <LoadingIndicator text='Cargando serie...' />
      </View>
    );
  }

  if (errorPartidos || errorSerie || !serie) {
    return (
      <View>
        <StyledAlert
          variant='error'
          message={
            errorPartidos ||
            errorSerie ||
            'Error al obtener informacion de la serie'
          }
        />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 6 }}>
      <Stack.Screen
        options={{
          title: `${serie.local.nombre} vs ${serie.visitante.nombre}`,
        }}
      />
      {partidos.length === 0 ? (
        <StyledAlert
          variant='warning'
          message='No hay partidos en esta serie'
        />
      ) : (
        partidos.map((partido, idx) => (
          <View key={partido.id}>
            {/* Agrupamos con un contenedor con key */}
            <StyledText
              size='large'
              variant='secondary'
              style={{ marginVertical: 8 }}
            >
              Partido {idx + 1}
            </StyledText>
            <TarjetaPartido partido={partido} reftechPartidos={fecthPartidos} />
          </View>
        ))
      )}
    </View>
  );
}
