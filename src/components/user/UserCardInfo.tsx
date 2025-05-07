import { View } from 'react-native';
import StyledText from '../common/StyledText';
import { UserBase } from '../../types/User';

interface UserCardInfoProps {
  user: UserBase;
}

export default function UserCardInfo({ user }: UserCardInfoProps) {
  return (
    <View>
      <StyledText>HOla esta en UserCardInfo</StyledText>
    </View>
  );
}
