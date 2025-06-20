import { View } from 'react-native';
import usePartidosJornadaActual from '../../hooks/usePartidosJornadaActual';
import LoadingIndicator from '../common/LoadingIndicator';
import StyledAlert from '../common/StyledAlert';
import TarjetaPartido from '../jornadas/TarjetaPartido';
import StyledText from '../common/StyledText';
import { TarjetaSerie } from '../jornadas/TarjetaSerie';
import { Serie } from '../../types/Serie';
import { Partido } from '../../types/Partido';

export default function MostrarJornadaActual() {
  const {
    errorPartidos,
    isLoadingPartidos,
    jornadaActual,
    competicionActual,
    partidos,
    series,
    getPartidosJornadaActual,
  } = usePartidosJornadaActual();

  if (isLoadingPartidos) {
    return <LoadingIndicator text='Cargando partidos...' />;
  }

  if (errorPartidos) {
    const errorVariant = errorPartidos.toLowerCase().includes('error')
      ? 'error'
      : 'info';
    return (
      <View
        style={{
          paddingHorizontal: 16,
        }}
      >
        <StyledAlert variant={errorVariant} message={errorPartidos} />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      {jornadaActual && competicionActual && (
        <>
          <StyledText size='large' style={{ marginLeft: 8 }}>
            {competicionActual.tipo === 'playoffs' ? 'Series' : 'Partidos'}
          </StyledText>
          <StyledText
            style={{ marginLeft: 8, marginTop: -5 }}
            size='medium'
            variant='secondary'
          >
            {jornadaActual?.nombre} ({competicionActual.nombre})
          </StyledText>

          {competicionActual.tipo === 'playoffs' ? (
            <MostrarSeriesInicio
              series={series}
              refetchSerie={getPartidosJornadaActual}
            />
          ) : (
            <MostrarPartidosInicio
              partidos={partidos}
              refetchPartidos={getPartidosJornadaActual}
            />
          )}
        </>
      )}
    </View>
  );
}

function MostrarSeriesInicio({
  series,
  refetchSerie,
}: {
  series: Serie[];
  refetchSerie: () => void;
}) {
  if (series.length === 0) {
    return <StyledAlert variant='info' message='No hay series disponibles' />;
  }
  return (
    <View style={{ gap: 12, marginTop: 12 }}>
      {series.map((serie, index) => (
        <TarjetaSerie key={index} serie={serie} refetchSerie={refetchSerie} />
      ))}
    </View>
  );
}

function MostrarPartidosInicio({
  partidos,
  refetchPartidos,
}: {
  partidos: Partido[];
  refetchPartidos: () => void;
}) {
  if (partidos.length === 0) {
    return <StyledAlert variant='info' message='No hay partidos disponibles' />;
  }
  return (
    <View style={{ gap: 12, marginTop: 12 }}>
      {partidos.map((partido, index) => (
        <TarjetaPartido
          key={index}
          partido={partido}
          refetchPartidos={refetchPartidos}
        />
      ))}
    </View>
  );
}
