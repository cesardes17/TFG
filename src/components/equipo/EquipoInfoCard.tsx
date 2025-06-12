import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';

type TeamCardProps = {
  nombre: string;
  escudoUrl: string;
  capitan: {
    nombre: string;
    apellidos: string;
    correo: string;
    id: string;
  };
  clasificacion: {
    id: string;
    puntos: number;
    partidosJugados: number;
    victorias: number;
    derrotas: number;
    puntosFavor: number;
    puntosContra: number;
    diferencia: number;
  } | null;
};

export default function TeamCard({
  nombre,
  escudoUrl,
  capitan,
  clasificacion,
}: TeamCardProps) {
  const { theme } = useTheme();

  // Calcular estadísticas por partido si hay clasificación
  const ppj = clasificacion
    ? (clasificacion.puntosFavor / clasificacion.partidosJugados).toFixed(1)
    : '0';
  const pcpj = clasificacion
    ? (clasificacion.puntosContra / clasificacion.partidosJugados).toFixed(1)
    : '0';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardDefault, shadowColor: theme.text.primary },
      ]}
    >
      {/* Sección izquierda */}
      <View
        style={[
          styles.leftSection,
          {
            borderRightColor: theme.border.secondary,
            borderBottomColor: theme.border.secondary,
          },
        ]}
      >
        <Image
          source={{ uri: escudoUrl }}
          style={styles.logo}
          resizeMode='contain'
        />
        <StyledText variant='primary' size={18} style={styles.teamName}>
          {nombre}
        </StyledText>
        <View style={styles.captainContainer}>
          <StyledText variant='secondary' size={16} style={styles.sectionTitle}>
            Capitán
          </StyledText>
          <StyledText variant='primary' size={15} style={styles.captainName}>
            {capitan.nombre} {capitan.apellidos}
          </StyledText>
          <StyledText variant='secondary' size={13} style={styles.captainEmail}>
            {capitan.correo}
          </StyledText>
        </View>
      </View>

      {/* Sección derecha */}
      <View style={styles.rightSection}>
        <StyledText variant='secondary' size={16} style={styles.sectionTitle}>
          Estadísticas Clasificación
        </StyledText>
        {clasificacion?.partidosJugados !== undefined &&
        clasificacion?.partidosJugados > 0 ? (
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <StyledText
                  variant='secondary'
                  size={12}
                  style={styles.statLabel}
                >
                  PJ
                </StyledText>
                <StyledText
                  variant='primary'
                  size={16}
                  style={styles.statValue}
                >
                  {clasificacion.partidosJugados}
                </StyledText>
              </View>
              <View style={styles.statItem}>
                <StyledText
                  variant='secondary'
                  size={12}
                  style={styles.statLabel}
                >
                  PF
                </StyledText>
                <StyledText
                  variant='primary'
                  size={16}
                  style={styles.statValue}
                >
                  {clasificacion.puntosFavor}
                </StyledText>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <StyledText
                  variant='secondary'
                  size={12}
                  style={styles.statLabel}
                >
                  PC
                </StyledText>
                <StyledText
                  variant='primary'
                  size={16}
                  style={styles.statValue}
                >
                  {clasificacion.puntosContra}
                </StyledText>
              </View>
              <View style={styles.statItem}>
                <StyledText
                  variant='secondary'
                  size={12}
                  style={styles.statLabel}
                >
                  Dif
                </StyledText>
                <StyledText
                  variant='primary'
                  size={16}
                  style={styles.statValue}
                >
                  {clasificacion.diferencia}
                </StyledText>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <StyledText
                  variant='secondary'
                  size={12}
                  style={styles.statLabel}
                >
                  PPJ
                </StyledText>
                <StyledText
                  variant='primary'
                  size={16}
                  style={styles.statValue}
                >
                  {ppj}
                </StyledText>
              </View>
              <View style={styles.statItem}>
                <StyledText
                  variant='secondary'
                  size={12}
                  style={styles.statLabel}
                >
                  PCPJ
                </StyledText>
                <StyledText
                  variant='primary'
                  size={16}
                  style={styles.statValue}
                >
                  {pcpj}
                </StyledText>
              </View>
            </View>
          </View>
        ) : (
          <StyledText
            variant='secondary'
            size={15}
            style={[styles.noStats, { color: theme.text.secondary }]}
          >
            Sin estadísticas disponibles
          </StyledText>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexWrap: 'wrap',
  },
  leftSection: {
    flex: 1,
    minWidth: 150,
    alignItems: 'center',
    paddingRight: 8,
    borderRightWidth: isSmallScreen ? 0 : 1,
    borderBottomWidth: isSmallScreen ? 1 : 0,
    paddingBottom: isSmallScreen ? 16 : 0,
    marginBottom: isSmallScreen ? 16 : 0,
  },
  rightSection: {
    flex: 1,
    minWidth: 150,
    paddingLeft: isSmallScreen ? 0 : 8,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  teamName: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  captainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  captainName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  captainEmail: {},
  statsContainer: {
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    marginBottom: 2,
  },
  statValue: {
    fontWeight: '600',
  },
  noStats: {
    fontStyle: 'italic',
    marginTop: 20,
  },
});
