import { View } from 'react-native';
import StyledText from '../components/common/StyledText';
import CompeticionesCards from '../components/inicio/EstadoCompeticiones';

export default function IndexScreen() {
  return (
    <View>
      <CompeticionesCards />
    </View>
  );
}
