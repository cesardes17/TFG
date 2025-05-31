import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import StyledButton from '../../common/StyledButton';

interface Equipo {
  id: string;
  nombre: string;
  escudoUrl: string;
}

interface MesaEquipoProps {
  equipo: Equipo;
  faltasCometidas: number;
  tiemposMuertos: number;
  tipo: 'local' | 'visitante';
  onSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
}

const MesaEquipo: React.FC<MesaEquipoProps> = ({
  equipo,
  faltasCometidas,
  tiemposMuertos,
  tipo,
  onSolicitarTiempoMuerto,
}) => {
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const faltasRestantes = Math.max(0, 5 - faltasCometidas);
  //   const estaEnBonus = faltasRestantes === 0;
  const estaEnBonus = true;
  const timeoutsMaximosPorMitad = 1;
  const timeoutsDisponibles = Math.max(
    0,
    timeoutsMaximosPorMitad - tiemposMuertos
  );

  //   const sinTimeoutsDisponibles = timeoutsDisponibles === 0;
  const sinTimeoutsDisponibles = true;

  return (
    <View
      style={[
        styles.container,
        { flexDirection: tipo === 'local' ? 'row' : 'row-reverse' },
      ]}
    >
      {/* Columna Izquierda */}
      <View style={styles.columnaIzquierda}>
        <View style={styles.escudoContainer}>
          <Image
            source={{ uri: equipo.escudoUrl }}
            style={[
              styles.escudo,
              { width: isTablet ? 80 : 60, height: isTablet ? 80 : 60 },
            ]}
            resizeMode='contain'
          />
        </View>

        <Text style={[styles.nombreEquipo, { fontSize: isTablet ? 18 : 16 }]}>
          {equipo.nombre}
        </Text>

        <StyledButton
          onPress={() => {
            onSolicitarTiempoMuerto(tipo);
          }}
          title='TIEMPO MUERTO'
        />
      </View>

      {/* Columna Derecha */}
      <View style={styles.columnaDerecha}>
        {/* Tarjeta de Faltas */}
        <View style={[styles.tarjeta, estaEnBonus && styles.tarjetaBonus]}>
          <Text style={[styles.numero, { fontSize: isTablet ? 32 : 28 }]}>
            {faltasRestantes}
          </Text>
          <Text style={[styles.etiqueta, { fontSize: isTablet ? 14 : 12 }]}>
            FALTAS RESTANTES
          </Text>
        </View>

        {/* Tarjeta de Timeouts */}
        <View
          style={[
            styles.tarjeta,
            sinTimeoutsDisponibles && styles.tarjetaBonus,
          ]}
        >
          <Text style={[styles.numero, { fontSize: isTablet ? 32 : 28 }]}>
            {timeoutsDisponibles}
          </Text>
          <Text style={[styles.etiqueta, { fontSize: isTablet ? 14 : 12 }]}>
            TIMEOUTS DISPONIBLES
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  columnaIzquierda: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
  },
  escudoContainer: {
    marginBottom: 12,
  },
  escudo: {
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  nombreEquipo: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  columnaDerecha: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  tarjeta: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tarjetaBonus: {
    borderColor: '#FF0000',
    backgroundColor: '#FFEAEA',
  },
  numero: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  etiqueta: {
    fontWeight: '600',
    color: '#6c757d',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default MesaEquipo;
