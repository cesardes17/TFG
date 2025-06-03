import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { EstadisticasJugador } from '../../../types/estadisticas/jugador';
import { EstadisticasTiro } from '../../../types/estadisticas/tiro';
import { useResponsiveWidth } from '../../../hooks/useResponsiveWidth';
import StyledText from '../../common/StyledText';
import { useTheme } from '../../../contexts/ThemeContext';
import ProgressiveImage from '../../common/ProgressiveImage';
import { router } from 'expo-router';

type Props = {
  local: Record<string, EstadisticasJugador>;
  visitante: Record<string, EstadisticasJugador>;
};

const EstadisticasJugadoresTabla: React.FC<Props> = ({ local, visitante }) => {
  const { containerWidth } = useResponsiveWidth();
  const { theme } = useTheme();

  const todosLosJugadores = [
    ...Object.values(local),
    ...Object.values(visitante),
  ];

  const jugadoresOrdenados = todosLosJugadores.sort(
    (a, b) => b.puntos - a.puntos
  );

  const calcularPorcentaje = (tiro: EstadisticasTiro): string => {
    const intentados = tiro.anotados + tiro.fallados;
    if (intentados === 0) return '0%';
    const porcentaje = (tiro.anotados / intentados) * 100;
    return `${Math.round(porcentaje)}%`;
  };

  const formatearTiro = (tiro: EstadisticasTiro): string => {
    const intentados = tiro.anotados + tiro.fallados;
    return `${tiro.anotados}/${intentados} (${calcularPorcentaje(tiro)})`;
  };

  const renderHeader = () => (
    <View style={styles.row}>
      <View style={styles.jugadorColumn}>
        <View style={styles.jugadorInfo}>
          <View style={styles.foto} />
          <View style={styles.nombreContainer}>
            <StyledText style={[styles.nombreText, styles.headerText]}>
              Jugador
            </StyledText>
            <StyledText style={styles.apellidoText}> </StyledText>
          </View>
        </View>
      </View>
      <View style={styles.ptsColumn}>
        <StyledText style={styles.headerText}>PTS</StyledText>
      </View>
      <View style={styles.tiroColumn}>
        <StyledText style={styles.headerText}>TL</StyledText>
      </View>
      <View style={styles.tiroColumn}>
        <StyledText style={styles.headerText}>T2</StyledText>
      </View>
      <View style={styles.tiroColumn}>
        <StyledText style={styles.headerText}>T3</StyledText>
      </View>
      <View style={styles.simpleStatColumn}>
        <StyledText style={styles.headerText}>AST</StyledText>
      </View>
      <View style={styles.simpleStatColumn}>
        <StyledText style={styles.headerText}>REB</StyledText>
      </View>
      <View style={styles.simpleStatColumn}>
        <StyledText style={styles.headerText}>FLT</StyledText>
      </View>
    </View>
  );

  const renderJugador = (jugador: EstadisticasJugador, index: number) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: 'jugador/[id]',
          params: { id: jugador.jugadorId },
        });
      }}
      key={index}
      style={[
        styles.row,
        {
          backgroundColor:
            index % 2 === 0
              ? theme.table.rowEvenBackground
              : theme.table.rowOddBackground,
        },
      ]}
    >
      <View style={styles.jugadorColumn}>
        <View style={styles.jugadorInfo}>
          <ProgressiveImage
            uri={jugador.fotoUrl}
            containerStyle={styles.foto}
          />
          <View style={styles.nombreContainer}>
            <StyledText style={styles.nombreText} numberOfLines={1}>
              {jugador.nombre}
            </StyledText>
            <StyledText style={styles.apellidoText} numberOfLines={1}>
              {jugador.apellidos}
            </StyledText>
          </View>
        </View>
      </View>
      <View style={styles.ptsColumn}>
        <StyledText style={styles.statText}>{jugador.puntos}</StyledText>
      </View>
      <View style={styles.tiroColumn}>
        <StyledText style={styles.statText} numberOfLines={2}>
          {formatearTiro(jugador.tirosLibres)}
        </StyledText>
      </View>
      <View style={styles.tiroColumn}>
        <StyledText style={styles.statText} numberOfLines={2}>
          {formatearTiro(jugador.tirosDos)}
        </StyledText>
      </View>
      <View style={styles.tiroColumn}>
        <StyledText style={styles.statText} numberOfLines={2}>
          {formatearTiro(jugador.tirosTres)}
        </StyledText>
      </View>
      <View style={styles.simpleStatColumn}>
        <StyledText style={styles.statText}>{jugador.asistencias}</StyledText>
      </View>
      <View style={styles.simpleStatColumn}>
        <StyledText style={styles.statText}>{jugador.rebotes}</StyledText>
      </View>
      <View style={styles.simpleStatColumn}>
        <StyledText style={styles.statText}>
          {jugador.faltasCometidas}
        </StyledText>
      </View>
    </TouchableOpacity>
  );

  const minTableWidth = 580;
  const tableWidth = Math.max(containerWidth, minTableWidth);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width: tableWidth }}>
          {renderHeader()}
          {jugadoresOrdenados.map((jugador, index) =>
            renderJugador(jugador, index)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 8,
  },
  jugadorColumn: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  ptsColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiroColumn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  simpleStatColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  jugadorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  nombreContainer: {
    flex: 1,
  },
  nombreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  apellidoText: {
    fontSize: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statText: {
    fontSize: 12,
  },
});

export default EstadisticasJugadoresTabla;
