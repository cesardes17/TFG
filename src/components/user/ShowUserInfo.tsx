//src/components/user/ShowUserInfo.tsx
import { isPlayer } from '../../types/User';
import UserCardInfo from './UserCardInfo';
import PlayerCardInfo from './PlayerCardInfo';
import { useUser } from '../../contexts/UserContext';
import StyledAlert from '../common/StyledAlert';

interface ShowUserInfoProps {
  screenLoading: (isLoading: boolean) => void;
}

export default function ShowUserInfo({ screenLoading }: ShowUserInfoProps) {
  const { user, loadingUser } = useUser();
  if (loadingUser) {
    screenLoading(true);
    return <></>;
  }
  if (!user) {
    return <StyledAlert variant='error' message='No hay usuario Activo' />;
  }

  if (isPlayer(user)) {
    return <PlayerCardInfo player={user} />;
  }

  return <UserCardInfo user={user} />;
}
