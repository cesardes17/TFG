import { StyleSheet, View } from 'react-native';
import StyledText from '../common/StyledText';
import { UserBase } from '../../types/User';
import { useTheme } from '../../contexts/ThemeContext';
import { AtIcon, BadgeAccountIcon, UserIcon } from '../Icons';

interface UserCardInfoProps {
  user: UserBase;
}

export default function UserCardInfo({ user }: UserCardInfoProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <StyledText style={[styles.title, { color: theme.text.primary }]}>
        Información del Usuario:
      </StyledText>
      <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
        <UserIcon size={24} color={theme.text.primary} />
        <StyledText
          style={[styles.nombreMobile, { color: theme.text.primary }]}
        >
          {user.nombre + ' ' + user.apellidos}
        </StyledText>
      </View>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <AtIcon size={20} color={theme.text.primary} />
        <StyledText style={{ color: theme.text.primary }}>
          {user.correo}
        </StyledText>
      </View>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <BadgeAccountIcon size={20} color={theme.text.primary} />
        <StyledText style={{ color: theme.text.primary }}>
          {user.role}
        </StyledText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  nombreMobile: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    alignSelf: 'center',
  },
});
