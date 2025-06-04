import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import { PlayerUser } from '../../types/User';
import { EstadisticasSimpleJugador } from '../../types/estadisticas/jugador';

interface JugadorInfoCardProps {
  jugadorInfo: PlayerUser;
  estadisticas: EstadisticasSimpleJugador | null;
}

export default function JugadorInfoCard({
  jugadorInfo,
  estadisticas,
}: JugadorInfoCardProps) {
  const { theme } = useTheme();

  const { nombre, apellidos, dorsal, altura, peso, posicion, correo, fotoUrl } =
    jugadorInfo;
  const nombreCompleto = `${nombre} ${apellidos}`;

  const calcularPromedios = () => {
    if (!estadisticas || estadisticas.partidosJugados === 0) {
      return null;
    }

    const { puntos, asistencias, rebotes, faltasCometidas, partidosJugados } =
      estadisticas;

    return {
      puntosPorPartido: (puntos / partidosJugados).toFixed(1),
      asistenciasPorPartido: (asistencias / partidosJugados).toFixed(1),
      rebotesPorPartido: (rebotes / partidosJugados).toFixed(1),
      faltasPorPartido: (faltasCometidas / partidosJugados).toFixed(1),
    };
  };

  const promedios = calcularPromedios();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardDefault,
          borderColor: theme.border.secondary,
        },
      ]}
    >
      {/* Sección Izquierda - Información Básica */}
      <View style={styles.leftSection}>
        <Image source={{ uri: fotoUrl }} style={styles.avatar} />

        <View style={styles.basicInfo}>
          <StyledText style={styles.playerName} variant='primary' size='large'>
            {nombreCompleto}
          </StyledText>
          <StyledText style={styles.email} variant='secondary' size='small'>
            {correo}
          </StyledText>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <StyledText style={styles.detailLabel}>Dorsal:</StyledText>
              <StyledText style={styles.detailValue}>#{dorsal}</StyledText>
            </View>

            <View style={styles.detailRow}>
              <StyledText style={styles.detailLabel}>Altura:</StyledText>
              <StyledText style={styles.detailValue}>{altura} cm</StyledText>
            </View>

            <View style={styles.detailRow}>
              <StyledText style={styles.detailLabel}>Peso:</StyledText>
              <StyledText style={styles.detailValue}>{peso} kg</StyledText>
            </View>

            <View style={styles.detailRow}>
              <StyledText style={styles.detailLabel}>Posición:</StyledText>
              <StyledText style={styles.detailValue}>{posicion}</StyledText>
            </View>
          </View>
        </View>
      </View>

      {/* Sección Derecha - Estadísticas */}
      <View style={styles.rightSection}>
        <StyledText style={styles.statsTitle} variant='primary' size='medium'>
          Promedios por Partido
        </StyledText>

        {promedios ? (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <StyledText style={styles.statValue} variant='primary'>
                {promedios.puntosPorPartido}
              </StyledText>
              <StyledText style={styles.statLabel} variant='secondary'>
                Puntos
              </StyledText>
            </View>

            <View style={styles.statItem}>
              <StyledText style={styles.statValue} variant='primary'>
                {promedios.asistenciasPorPartido}
              </StyledText>
              <StyledText style={styles.statLabel} variant='secondary'>
                Asistencias
              </StyledText>
            </View>

            <View style={styles.statItem}>
              <StyledText style={styles.statValue} variant='primary'>
                {promedios.rebotesPorPartido}
              </StyledText>
              <StyledText style={styles.statLabel} variant='secondary'>
                Rebotes
              </StyledText>
            </View>

            <View style={styles.statItem}>
              <StyledText style={styles.statValue} variant='primary'>
                {promedios.faltasPorPartido}
              </StyledText>
              <StyledText style={styles.statLabel} variant='secondary'>
                Faltas
              </StyledText>
            </View>
          </View>
        ) : (
          <View style={styles.noStatsContainer}>
            <StyledText style={styles.noStatsText} variant='secondary'>
              Sin estadísticas disponibles
            </StyledText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    minHeight: 200,
    borderWidth: 1,
  },
  leftSection: {
    flex: 1,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  rightSection: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    alignSelf: 'center',
  },
  basicInfo: {
    flex: 1,
  },
  playerName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8F9FA0E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  noStatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStatsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
