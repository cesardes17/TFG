import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledAlert from '../common/StyledAlert';
import { Inscripcion } from '../../types/Inscripcion';

interface Player {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fotoUrl: string;
  dorsal: number;
}

interface PlayerRowProps {
  player: Player;
  isEven: boolean;
}

// Table header component
const TableHeader = () => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.headerRow,
        { backgroundColor: theme.table.headerBackground },
      ]}
    >
      <View style={styles.photoContainer}>
        <Text style={[styles.headerText, { color: theme.table.headerText }]}>
          Foto
        </Text>
      </View>
      <View style={styles.dorsalContainer}>
        <Text style={[styles.headerText, { color: theme.table.headerText }]}>
          Dorsal
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.headerText, { color: theme.table.headerText }]}>
          Jugador
        </Text>
      </View>
    </View>
  );
};

// Player row component
const PlayerRow = ({ player, isEven }: PlayerRowProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isEven
            ? theme.table.rowEvenBackground
            : theme.table.rowOddBackground,
          borderBottomColor: theme.table.rowBorder,
        },
      ]}
    >
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: player.fotoUrl }}
          style={[styles.photo, { borderColor: theme.border.primary }]}
        />
      </View>
      <View style={styles.dorsalContainer}>
        <Text style={[styles.dorsalText, { color: theme.text.primary }]}>
          {player.dorsal}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.nameText, { color: theme.table.rowText }]}>
          {`${player.nombre} ${player.apellidos}`}
        </Text>
        <Text style={[styles.emailText, { color: theme.text.secondary }]}>
          {player.correo}
        </Text>
      </View>
    </View>
  );
};
interface TablaJugadoresProps {
  players: Inscripcion[];
}
// Main player table component
const TablaJugadores = ({ players }: TablaJugadoresProps) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.cardDefault }]}>
      <TableHeader />
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PlayerRow player={item.jugador} isEven={index % 2 === 0} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <StyledAlert
                message='No hay jugadores en este equipo'
                variant='info'
              />
            </View>
          );
        }}
      />
    </View>
  );
};

// Get screen width for responsive design
const { width } = Dimensions.get('window');

// Styles
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 400,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  photoContainer: {
    width: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
  },
  dorsalContainer: {
    width: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dorsalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
  },
});

export default TablaJugadores;
