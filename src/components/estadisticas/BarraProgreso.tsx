import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  porcentaje: number;
  color: string;
  esLocal?: boolean;
}

const BarraProgresoSimple: React.FC<Props> = ({
  porcentaje,
  color,
  esLocal = false,
}) => {
  return (
    <View style={styles.fondo}>
      <View
        style={[
          styles.relleno,
          {
            width: `${porcentaje}%`,
            backgroundColor: color,
            alignSelf: esLocal ? 'flex-end' : 'flex-start',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fondo: {
    height: 8, // Altura explícita
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  relleno: {
    height: '100%',
  },
});

export default BarraProgresoSimple;
