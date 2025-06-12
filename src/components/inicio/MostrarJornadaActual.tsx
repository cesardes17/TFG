import { View } from 'react-native';
import usePartidosJornadaActual from '../../hooks/usePartidosJornadaActual';
import LoadingIndicator from '../common/LoadingIndicator';
import StyledAlert from '../common/StyledAlert';
import TarjetaPartido from '../jornadas/TarjetaPartido';
import StyledText from '../common/StyledText';

export default function MostrarJornadaActual() {
  const {
    errorPartidos,
    isLoadingPartidos,
    jornadaActual,
    competicionActual,
    partidos,
    getPartidosJornadaActual,
  } = usePartidosJornadaActual();

  if (isLoadingPartidos) {
    return <LoadingIndicator text='Cargando partidos...' />;
  }

  if (errorPartidos) {
    return <StyledAlert variant='error' message={errorPartidos} />;
  }

  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      {jornadaActual && competicionActual && (
        <>
          <StyledText size='large'> Partidos</StyledText>
          <StyledText
            style={{ marginLeft: 8, marginTop: -5 }}
            size='medium'
            variant='secondary'
          >
            {jornadaActual?.nombre} ({competicionActual.nombre})
          </StyledText>
        </>
      )}
      {partidos.length > 0 ? (
        partidos.map((partido, index) => {
          return (
            <TarjetaPartido
              key={index}
              partido={partido}
              reftechPartidos={getPartidosJornadaActual}
            />
          );
        })
      ) : (
        <StyledAlert variant='info' message='No hay partidos para mostrar' />
      )}
    </View>
  );
}
