import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledAlert from '../common/StyledAlert';
import { Inscripcion } from '../../types/Inscripcion';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';
import { router } from 'expo-router';

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

interface TablaJugadoresProps {
  players: Inscripcion[];
}

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
        <StyledText
          style={[styles.headerText, { color: theme.table.headerText }]}
        >
          Foto
        </StyledText>
      </View>
      <View style={styles.dorsalContainer}>
        <StyledText
          style={[styles.headerText, { color: theme.table.headerText }]}
        >
          Dorsal
        </StyledText>
      </View>
      <View style={styles.infoContainer}>
        <StyledText
          style={[styles.headerText, { color: theme.table.headerText }]}
        >
          Jugador
        </StyledText>
      </View>
    </View>
  );
};

const PlayerRow = ({ player, isEven }: PlayerRowProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: 'jugador/[id]',
          params: { id: player.id },
        });
      }}
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
        <ProgressiveImage
          uri={player.fotoUrl}
          containerStyle={[styles.photo, { borderColor: theme.border.primary }]}
        />
      </View>
      <View style={styles.dorsalContainer}>
        <StyledText style={[styles.dorsalText, { color: theme.text.primary }]}>
          {player.dorsal}
        </StyledText>
      </View>
      <View style={styles.infoContainer}>
        <StyledText style={[styles.nameText, { color: theme.table.rowText }]}>
          {`${player.nombre} ${player.apellidos}`}
        </StyledText>
        <StyledText style={[styles.emailText, { color: theme.text.secondary }]}>
          {player.correo}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

export default function TablaJugadores({ players }: TablaJugadoresProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.cardDefault }]}>
      <TableHeader />
      {players.length === 0 ? (
        <View style={{ padding: 10, alignItems: 'center' }}>
          <StyledAlert
            message='No hay jugadores en este equipo'
            variant='info'
          />
        </View>
      ) : (
        players.map((inscripcion, index) => (
          <PlayerRow
            key={inscripcion.id}
            player={inscripcion.jugador}
            isEven={index % 2 === 0}
          />
        ))
      )}
    </View>
  );
}

// Estilos
const { width } = Dimensions.get('window');

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
    textAlign: 'center',
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
