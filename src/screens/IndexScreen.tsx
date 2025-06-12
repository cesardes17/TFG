import { View } from 'react-native';

import CompeticionesCards from '../components/inicio/EstadoCompeticiones';
import MostrarJornadaActual from '../components/inicio/MostrarJornadaActual';

export default function IndexScreen() {
  return (
    <View>
      <CompeticionesCards />
      <MostrarJornadaActual />
    </View>
  );
}
