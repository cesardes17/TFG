import React from 'react';
import { View, StyleSheet } from 'react-native';
import BarraProgresoSimple from '../../estadisticas/BarraProgreso';

interface Props {
  porcentajeLocal: number;
  porcentajeVisitante: number;
}

const BarraProgresoComparativa: React.FC<Props> = ({
  porcentajeLocal,
  porcentajeVisitante,
}) => {
  return (
    <View style={styles.barraComparativa}>
      <View style={styles.barraMitad}>
        <BarraProgresoSimple
          porcentaje={porcentajeLocal}
          color='#007bff' // Azul para local
          esLocal={true}
        />
      </View>
      <View style={styles.barraMitad}>
        <BarraProgresoSimple
          porcentaje={porcentajeVisitante}
          color='#10920CFF' // Verde para visitante
          esLocal={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barraComparativa: {
    flexDirection: 'row',
    height: 8,
    marginTop: 4,
  },
  barraMitad: {
    flex: 1,
    paddingHorizontal: 2,
  },
});

export default BarraProgresoComparativa;
