import { View } from 'react-native';
import StyledText from '../common/StyledText';
import { PlayerUser } from '../../types/User';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import PlayerMobileInfo from './PlayerDisplay/PlayerMobileInfo';
import PlayerWebInfo from './PlayerDisplay/PlayerWebInfo';

interface PlayerCardInfoProps {
  player: PlayerUser;
}

export default function PlayerCardInfo({ player }: PlayerCardInfoProps) {
  const { isMobile } = useResponsiveLayout();

  return isMobile ? (
    <PlayerMobileInfo player={player} />
  ) : (
    <PlayerWebInfo player={player} />
  );
}
