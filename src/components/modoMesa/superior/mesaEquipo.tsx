// src/components/mesa/MesaEquipo.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import StyledButton from '../../common/StyledButton';
import StyledText from '../../common/StyledText';
import { useTheme } from '../../../contexts/ThemeContext';

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
  puedeSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => boolean;
  onSolicitarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
  onCancelarTiempoMuerto: (equipo: 'local' | 'visitante') => void;
}

export default function MesaEquipo({
  equipo,
  puntos,
  faltasCometidas,
  puedeSolicitarTiempoMuerto,
  tiempoMuertoSolicitado,
  tiempoMuertoIniciado,
  tipo,
  cuartoActual,
  onSolicitarTiempoMuerto,
  onCancelarTiempoMuerto,
}: MesaEquipoProps) {
  const { theme } = useTheme();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const faltasRestantes = Math.max(0, 5 - faltasCometidas);
  const estaEnBonus = faltasRestantes === 0;
  const hayTiempoMuertoDisponible = puedeSolicitarTiempoMuerto(tipo);

  return (
    <View
      style={[
        styles.container,
        { flexDirection: tipo === 'local' ? 'row' : 'row-reverse' },
        {
          backgroundColor: theme.cardDefault,
          borderColor: theme.border.secondary,
          borderWidth: 1,
        },
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
                { backgroundColor: theme.background.navigation },
              ]}
              resizeMode='contain'
            />
            <StyledText
              size='small'
              style={styles.nombreEquipo}
              variant='primary'
            >
              {equipo.nombre}
            </StyledText>
          </View>

          <View style={styles.puntosContainer}>
            <StyledText
              size={isTablet ? 28 : 24}
              style={styles.puntosTexto}
              variant='primary'
            >
              {puntos}
            </StyledText>
            <StyledText
              size='small'
              style={styles.puntosLabel}
              variant='secondary'
            >
              PUNTOS
            </StyledText>
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
              disabled={tiempoMuertoIniciado}
            />
          )}

        {tiempoMuertoSolicitado && (
          <StyledButton
            onPress={() => onCancelarTiempoMuerto(tipo)}
            variant='error-outline'
            title='Cancelar Tiempo Muerto'
            disabled={tiempoMuertoIniciado}
          />
        )}
      </View>

      {/* Columna derecha: estadísticas */}
      <View style={styles.columnaDerecha}>
        <View
          style={[
            styles.tarjeta,
            {
              backgroundColor: '#F8F9FA0E',
              borderColor: theme.border.secondary,
            },
            estaEnBonus && styles.tarjetaBonus,
          ]}
        >
          <StyledText
            size={isTablet ? 32 : 28}
            style={styles.numero}
            variant='primary'
          >
            {faltasRestantes}
          </StyledText>
          <StyledText size='small' style={styles.etiqueta} variant='secondary'>
            FALTAS RESTANTES
          </StyledText>
        </View>

        <View
          style={[
            styles.tarjeta,
            {
              backgroundColor: '#F8F9FA0E',
              borderColor: theme.border.secondary,
            },
            !hayTiempoMuertoDisponible && styles.tarjetaBonus,
          ]}
        >
          <StyledText
            size={isTablet ? 32 : 28}
            style={styles.numero}
            variant='primary'
          >
            {hayTiempoMuertoDisponible ? '1' : '0'}
          </StyledText>
          <StyledText size='small' style={styles.etiqueta} variant='secondary'>
            TIMEOUTS DISPONIBLES
          </StyledText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  columnaIzquierda: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
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
  },
  nombreEquipo: {
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  puntosLabel: {
    fontWeight: '600',
  },
  columnaDerecha: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  tarjeta: {
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  tarjetaBonus: {
    borderColor: '#FF0000',
    backgroundColor: '#F06C6CFF',
  },
  numero: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  etiqueta: {
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
