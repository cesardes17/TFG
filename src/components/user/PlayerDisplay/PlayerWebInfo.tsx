import { Image, StyleSheet, View } from 'react-native';
import { PlayerUser } from '../../../types/User';
import StyledText from '../../common/StyledText';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  BasketballOutlineIcon,
  RulerIcon,
  WeightHangingIcon,
} from '../../Icons';

interface PlayerMobileInfoProps {
  player: PlayerUser;
}

export default function PlayerMobileInfo({ player }: PlayerMobileInfoProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.cardWeb}>
      <Image
        source={{ uri: player.fotoUrl }}
        style={styles.imageWeb}
        resizeMode='cover'
      />
      <View style={styles.contentWeb}>
        <StyledText style={styles.nombreWeb}>
          {player.nombre + ' ' + player.apellidos}
        </StyledText>
        <StyledText style={styles.rolWeb}>{player.rol}</StyledText>
        <View style={styles.row}>
          <BasketballOutlineIcon color={theme.icon.primary} size={20} />
          <StyledText style={styles.textWeb}>{player.posicion}</StyledText>
        </View>
        <View style={styles.row}>
          <RulerIcon color={theme.icon.primary} size={20} />
          <StyledText style={styles.textWeb}>{player.altura} cm</StyledText>
        </View>
        <View style={styles.row}>
          <WeightHangingIcon color={theme.icon.primary} size={20} />
          <StyledText style={styles.textWeb}>{player.peso} kg</StyledText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWeb: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWeb: {
    width: '30%',
    minWidth: 250,
    aspectRatio: 3 / 4,
  },
  contentWeb: {
    padding: 12,
  },
  nombreWeb: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rolWeb: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  textWeb: {
    fontSize: 16,
    marginLeft: 8,
  },
});
