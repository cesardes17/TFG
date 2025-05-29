import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  porcentajeLocal: number;
  porcentajeVisitante: number;
  esTiro?: boolean;
}

const BarraProgreso: React.FC<Props> = ({
  porcentajeLocal,
  porcentajeVisitante,
  esTiro = false,
}) => {
  return (
    <View style={styles.barraComparativa}>
      {/* Local - izquierda */}
      <View style={styles.barraMitad}>
        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraLocal,
              {
                width: `${porcentajeLocal}%`,
                alignSelf: 'flex-end',
              },
            ]}
          />
        </View>
      </View>

      {/* Visitante - derecha */}
      <View style={styles.barraMitad}>
        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraVisitante,
              {
                width: `${porcentajeVisitante}%`,
                alignSelf: 'flex-start',
              },
            ]}
          />
        </View>
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
  barraFondo: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  barraLocal: {
    height: '100%',
    backgroundColor: '#007bff',
  },
  barraVisitante: {
    height: '100%',
    backgroundColor: '#10920CFF',
  },
});

export default BarraProgreso;
