import { StyleSheet, View } from 'react-native';
import StyledText from '../common/StyledText';
import { solicitudCrearEquipo } from '../../types/Solicitud';

interface CrearEquipoCardProps {
  solicitud: solicitudCrearEquipo;
}

export default function CrearEquipoCard({ solicitud }: CrearEquipoCardProps) {
  return (
    <View style={styles.container}>
      <StyledText>Crear equipo</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
