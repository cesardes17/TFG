import { View } from 'react-native';
import StyledText from '../components/common/StyledText';

export default function IndexScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <StyledText>Pantalla de Inicio</StyledText>
    </View>
  );
}
