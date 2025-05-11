// src/components/player/PlayerWebInfo.tsx
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayerUser } from '../../../types/User';
import StyledText from '../../common/StyledText';
import {
  BadgeAccountIcon,
  BasketballOutlineIcon,
  RulerIcon,
  WeightHangingIcon,
} from '../../Icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { capitalizeFirst, titleCase } from '../../../utils/capitalizeString';
import { router } from 'expo-router';
import ProgressiveImage from '../../common/ProgressiveImage';

interface PlayerWebInfoProps {
  player: PlayerUser;
}

export default function PlayerWebInfo({ player }: PlayerWebInfoProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { borderColor: theme.border.primary }]}>
      {/* Foto principal */}
      <ProgressiveImage
        uri={player.photoURL}
        containerStyle={styles.imageContainer}
        imageStyle={styles.image}
      />

      {/* Dorsal en la esquina */}
      <View
        style={[
          styles.dorsalContainer,
          { backgroundColor: theme.background.navigation },
        ]}
      >
        <StyledText style={[styles.dorsal, { color: theme.text.light }]}>
          {player.dorsal}
        </StyledText>
      </View>

      {/* Datos personales */}
      <View style={styles.content}>
        <StyledText style={styles.name}>
          {titleCase(player.nombre + ' ' + player.apellidos)}
        </StyledText>

        <View style={styles.row}>
          <BadgeAccountIcon color={theme.icon.primary} size={20} />
          <StyledText size='large' style={styles.text}>
            {capitalizeFirst(player.role)}
          </StyledText>
        </View>
        <View style={styles.row}>
          <BasketballOutlineIcon color={theme.icon.primary} size={20} />
          <StyledText style={styles.text}>
            {titleCase(player.posicion)}
          </StyledText>
        </View>
        <View style={styles.row}>
          <RulerIcon color={theme.icon.primary} size={20} />
          <StyledText style={styles.text}>{player.altura} cm</StyledText>
        </View>
        <View style={styles.row}>
          <WeightHangingIcon color={theme.icon.primary} size={20} />
          <StyledText style={styles.text}>{player.peso} kg</StyledText>
        </View>
      </View>

      {/* Equipo */}
      {player.equipo && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/equipo/[id]',
              params: { id: player.equipo!.id },
            })
          }
          style={styles.teamButton}
        >
          <ProgressiveImage
            uri={player.equipo.escudoUrl}
            containerStyle={styles.teamImageContainer}
            imageStyle={styles.teamImage}
          />
          <StyledText style={styles.teamName}>
            {player.equipo.nombre}
          </StyledText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },

  imageContainer: {
    width: '100%',
    height: 250, // ajusta la altura deseada
  },
  image: {
    resizeMode: 'cover',
  },

  dorsalContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dorsal: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
  },

  teamButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  teamImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
  },
  teamImage: {
    resizeMode: 'cover',
  },
  teamName: {
    fontSize: 16,
  },
});
