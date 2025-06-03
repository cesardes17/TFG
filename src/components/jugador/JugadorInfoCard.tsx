import { View, Text, Image, StyleSheet } from 'react-native';
import { PlayerUser } from '../../types/User';
import { EstadisticasSimpleJugador } from '../../types/estadisticas/jugador';

interface JugadorInfoCardProps {
  jugadorInfo: PlayerUser;
  estadisticas: EstadisticasSimpleJugador | null;
}

export default function JugadorInfoCard({
  jugadorInfo, // Agrega aquí los campos que necesitas de jugadorInfo según tu estructura de datos en Firestore o de la API de Futb
  estadisticas,
}: JugadorInfoCardProps) {
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
    <View style={styles.card}>
      {/* Sección Izquierda - Información Básica */}
      <View style={styles.leftSection}>
        <Image source={{ uri: fotoUrl }} style={styles.avatar} />

        <View style={styles.basicInfo}>
          <Text style={styles.playerName}>{nombreCompleto}</Text>
          <Text style={styles.email}>{correo}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dorsal:</Text>
              <Text style={styles.detailValue}>#{dorsal}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Altura:</Text>
              <Text style={styles.detailValue}>{altura} cm</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Peso:</Text>
              <Text style={styles.detailValue}>{peso} kg</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Posición:</Text>
              <Text style={styles.detailValue}>{posicion}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sección Derecha - Estadísticas */}
      <View style={styles.rightSection}>
        <Text style={styles.statsTitle}>Promedios por Partido</Text>

        {promedios ? (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{promedios.puntosPorPartido}</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {promedios.asistenciasPorPartido}
              </Text>
              <Text style={styles.statLabel}>Asistencias</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {promedios.rebotesPorPartido}
              </Text>
              <Text style={styles.statLabel}>Rebotes</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{promedios.faltasPorPartido}</Text>
              <Text style={styles.statLabel}>Faltas</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noStatsContainer}>
            <Text style={styles.noStatsText}>Sin estadísticas disponibles</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    minHeight: 200,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  noStatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStatsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
