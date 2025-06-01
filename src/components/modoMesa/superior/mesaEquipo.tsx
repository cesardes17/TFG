import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import StyledButton from '../../common/StyledButton';
import StyledText from '../../common/StyledText';

interface Equipo {
  id: string;
  nombre: string;
  escudoUrl: string;
}

interface MesaEquipoProps {
  equipo: Equipo;
  puntos: number;
  faltasCometidas: number;
  tiempoMuertoSolicitado: boolean;
  tiempoMuertoIniciado: boolean;
  tipo: 'local' | 'visitante';
  cuartoActual: string;

  puedeSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => boolean; // 👈 Nueva prop
  onSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
}

const MesaEquipo: React.FC<MesaEquipoProps> = ({
  equipo,
  puntos,
  faltasCometidas,
  puedeSolicitarTiempoMuerto,
  tiempoMuertoSolicitado,
  tiempoMuertoIniciado,
  tipo,
  cuartoActual,
  onSolicitarTiempoMuerto,
}) => {
  const hayTiempoMuertoDisponible = puedeSolicitarTiempoMuerto(tipo);
  console.log(tiempoMuertoSolicitado);
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const faltasRestantes = Math.max(0, 5 - faltasCometidas);
  const estaEnBonus = faltasRestantes === 0;

  return (
    <View
      style={[
        styles.container,
        { flexDirection: tipo === 'local' ? 'row' : 'row-reverse' },
      ]}
    >
      {/* Columna izquierda: escudo, nombre, puntos, botón */}
      <View style={styles.columnaIzquierda}>
        <View
          style={[
            styles.zonaSuperior,
            { flexDirection: tipo === 'local' ? 'row' : 'row-reverse' },
          ]}
        >
          <View style={styles.escudoNombreContainer}>
            <Image
              source={{ uri: equipo.escudoUrl }}
              style={[
                styles.escudo,
                { width: isTablet ? 70 : 60, height: isTablet ? 70 : 60 },
              ]}
              resizeMode='contain'
            />
            <StyledText size='small' style={styles.nombreEquipo}>
              {equipo.nombre}
            </StyledText>
          </View>

          <View style={styles.puntosContainer}>
            <Text
              style={[
                styles.puntosTexto,
                { fontSize: isTablet ? 28 : 24, fontWeight: 'bold' },
              ]}
            >
              {puntos}
            </Text>
            <Text style={styles.puntosLabel}>PUNTOS</Text>
          </View>
        </View>

        {/* Botón para solicitar/cancelar tiempo muerto */}
        {hayTiempoMuertoDisponible &&
          !tiempoMuertoSolicitado &&
          cuartoActual !== 'DESCANSO' && (
            <StyledButton
              onPress={() => {
                onSolicitarTiempoMuerto(tipo);
              }}
              title='Solicitar Tiempo Muerto'
            />
          )}

        {tiempoMuertoSolicitado && (
          <StyledButton
            onPress={() => onSolicitarTiempoMuerto(tipo)}
            variant='error-outline'
            title='Cancelar Tiempo Muerto'
            disabled={tiempoMuertoIniciado}
          />
        )}
      </View>

      {/* Columna derecha: estadísticas */}
      <View style={styles.columnaDerecha}>
        <View style={[styles.tarjeta, estaEnBonus && styles.tarjetaBonus]}>
          <Text style={[styles.numero, { fontSize: isTablet ? 32 : 28 }]}>
            {faltasRestantes}
          </Text>
          <Text style={[styles.etiqueta, { fontSize: isTablet ? 14 : 12 }]}>
            FALTAS RESTANTES
          </Text>
        </View>

        <View
          style={[
            styles.tarjeta,
            !hayTiempoMuertoDisponible && styles.tarjetaBonus,
          ]}
        >
          <Text style={[styles.numero, { fontSize: isTablet ? 32 : 28 }]}>
            {hayTiempoMuertoDisponible ? '1' : '0'}
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
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
  },
  zonaSuperior: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  escudoNombreContainer: {
    alignItems: 'center',
  },
  escudo: {
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  nombreEquipo: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 100,
  },
  puntosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  puntosTexto: {
    color: '#3B82F6',
  },
  puntosLabel: {
    fontSize: 12,
    color: '#6c757d',
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
    paddingVertical: 12,
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
