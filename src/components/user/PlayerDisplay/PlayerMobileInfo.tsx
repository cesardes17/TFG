import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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
    <View style={styles.cardMobile}>
      <ProgressiveImage uri={player.photoURL} />
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
      <View style={styles.contentMobile}>
        <StyledText style={styles.nombreMobile}>
          {titleCase(player.nombre + ' ' + player.apellidos)}
        </StyledText>

        <View style={styles.column}>
          <View style={styles.row}>
            <BadgeAccountIcon color={theme.icon.active} size={20} />
            <StyledText size='large' style={styles.textMobile}>
              {capitalizeFirst(player.role)}
            </StyledText>
          </View>
          <View style={styles.row}>
            <BasketballOutlineIcon color={theme.icon.active} size={20} />
            <StyledText style={styles.textMobile}>
              {titleCase(player.posicion)}
            </StyledText>
          </View>

          <View style={styles.row}>
            <RulerIcon color={theme.icon.active} size={20} />
            <StyledText style={styles.textMobile}>
              {player.altura} cm
            </StyledText>
          </View>
          <View style={styles.row}>
            <WeightHangingIcon color={theme.icon.active} size={20} />
            <StyledText style={styles.textMobile}>{player.peso} kg</StyledText>
          </View>
        </View>
      </View>
      {player.equipo && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/equipo/[id]',
              params: { id: player.equipo!.id },
            })
          }
          style={{
            alignSelf: 'center',
            alignItems: 'center',
          }}
        >
          <ProgressiveImage
            uri={player.equipo.escudoUrl}
            style={styles.imageTeam}
          />
          <StyledText>{player.equipo.nombre}</StyledText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardMobile: {
    marginTop: 5,
    minWidth: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
  },
  imageTeam: {
    width: '20%',
    aspectRatio: 1,
  },
  imageMobile: {
    width: '100%',
    aspectRatio: 1,
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
  contentMobile: {
    padding: 16,
    gap: 12,
  },
  nombreMobile: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  column: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textMobile: {
    fontSize: 16,
    marginLeft: 8,
  },
});
