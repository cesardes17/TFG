import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import StyledAlert from '../common/StyledAlert';

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

const TeamCard: React.FC<TeamCardProps> = ({
  nombre,
  escudoUrl,
  capitan,
  clasificacion,
}) => {
  // Calcular estadísticas por partido si hay clasificación
  const ppj = clasificacion
    ? (clasificacion.puntosFavor / clasificacion.partidosJugados).toFixed(1)
    : '0';
  const pcpj = clasificacion
    ? (clasificacion.puntosContra / clasificacion.partidosJugados).toFixed(1)
    : '0';

  return (
    <View style={styles.container}>
      {/* Sección izquierda */}
      <View style={styles.leftSection}>
        <Image
          source={{ uri: escudoUrl }}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={styles.teamName}>{nombre}</Text>
        <View style={styles.captainContainer}>
          <Text style={styles.sectionTitle}>Capitán</Text>
          <Text style={styles.captainName}>
            {capitan.nombre} {capitan.apellidos}
          </Text>
          <Text style={styles.captainEmail}>{capitan.correo}</Text>
        </View>
      </View>

      {/* Sección derecha */}
      <View style={styles.rightSection}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {clasificacion?.partidosJugados !== undefined &&
        clasificacion?.partidosJugados > 0 ? (
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PJ</Text>
                <Text style={styles.statValue}>
                  {clasificacion.partidosJugados}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PF</Text>
                <Text style={styles.statValue}>
                  {clasificacion.puntosFavor}
                </Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PC</Text>
                <Text style={styles.statValue}>
                  {clasificacion.puntosContra}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Dif</Text>
                <Text style={styles.statValue}>{clasificacion.diferencia}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PPJ</Text>
                <Text style={styles.statValue}>{ppj}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PCPJ</Text>
                <Text style={styles.statValue}>{pcpj}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.noStats}>Sin estadísticas disponibles</Text>
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexWrap: 'wrap', // Para responsividad en pantallas pequeñas
  },
  leftSection: {
    flex: 1,
    minWidth: 150,
    alignItems: 'center',
    paddingRight: 8,
    borderRightWidth: isSmallScreen ? 0 : 1,
    borderRightColor: '#e0e0e0',
    borderBottomWidth: isSmallScreen ? 1 : 0,
    borderBottomColor: '#e0e0e0',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  captainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  captainName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  captainEmail: {
    fontSize: 13,
    color: '#666',
  },
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
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  noStats: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default TeamCard;
