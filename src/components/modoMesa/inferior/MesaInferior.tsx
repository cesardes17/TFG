// MesaInferior.tsx
import { View, StyleSheet } from 'react-native';
import StyledText from '../../common/StyledText';

export default function MesaInferior() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StyledText>MesaInferior</StyledText>
    </View>
  );
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.tercio}>
  //         <MesaJugadores equipo='local' />
  //       </View>
  //       <View style={styles.tercio}>
  //         <MesaHistorial />
  //       </View>
  //       <View style={styles.tercio}>
  //         <MesaJugadores equipo='visitante' />
  //       </View>
  //     </View>
  //   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tercio: {
    flex: 1,
    padding: 8,
  },
});
