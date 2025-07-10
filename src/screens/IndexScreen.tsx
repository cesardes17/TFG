import { View } from 'react-native';

import CompeticionesCards from '../components/inicio/EstadoCompeticiones';
import MostrarJornadaActual from '../components/inicio/MostrarJornadaActual';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import StyledAlert from '../components/common/StyledAlert';

export default function IndexScreen() {
  const { temporada } = useTemporadaContext();

  if (!temporada) {
    return (
      <View>
        <StyledAlert
          message='No hay temporada activa, no hay información para mostrar'
          variant='warning'
        />
      </View>
    );
  }
  return (
    <View>
      <CompeticionesCards />
      <MostrarJornadaActual />
    </View>
  );
}
