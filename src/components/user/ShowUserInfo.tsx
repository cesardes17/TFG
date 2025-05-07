import { Text, View } from 'react-native';
import { User, isPlayer } from '../../types/User';
import UserCardInfo from './UserCardInfo';
import PlayerCardInfo from './PlayerCardInfo';

interface UserInfoProps {
  user: User;
}

export default function ShowUserInfo({ user }: UserInfoProps) {
  if (isPlayer(user)) {
    return <PlayerCardInfo player={user} />;
  }

  return <UserCardInfo user={user} />;
}
