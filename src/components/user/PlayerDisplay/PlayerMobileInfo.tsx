import { Image, StyleSheet, View } from 'react-native';
import { PlayerUser } from '../../../types/User';
import StyledText from '../../common/StyledText';
import {
  BadgeAccountIcon,
  BasketballOutlineIcon,
  RulerIcon,
  WeightHangingIcon,
} from '../../Icons';
import { useTheme } from '../../../contexts/ThemeContext';

interface PlayerWebInfoProps {
  player: PlayerUser;
}

export default function PlayerWebInfo({ player }: PlayerWebInfoProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.cardMobile}>
      <Image
        source={{ uri: player.photoURL }}
        style={styles.imageMobile}
        resizeMode='cover'
      />
      <View style={styles.dorsalContainer}>
        <StyledText style={styles.dorsal}>{player.dorsal}</StyledText>
      </View>
      <View style={styles.contentMobile}>
        <StyledText style={styles.nombreMobile}>
          {player.nombre + ' ' + player.apellidos}
        </StyledText>
        <View style={styles.column}>
          <View style={styles.row}>
            <BadgeAccountIcon color={theme.icon.active} size={20} />
            <StyledText size='large' style={styles.textMobile}>
              {player.role}
            </StyledText>
          </View>
          <View style={styles.row}>
            <BasketballOutlineIcon color={theme.icon.active} size={20} />
            <StyledText style={styles.textMobile}>{player.posicion}</StyledText>
          </View>
        </View>
        <View style={styles.column}>
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
  imageMobile: {
    width: '100%',
    aspectRatio: 1,
  },
  dorsalContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'red',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dorsal: {
    color: '#fff',
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
    justifyContent: 'space-evenly',
  },
  textMobile: {
    fontSize: 16,
    marginLeft: 8,
  },
});
