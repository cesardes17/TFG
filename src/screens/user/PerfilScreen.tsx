import { View, TouchableOpacity, StyleSheet } from 'react-native';
import StyledText from '../../components/common/StyledText';
import { AuthService } from '../../services/core/authService';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import ShowUserInfo from '../../components/user/ShowUserInfo';
import { useUser } from '../../contexts/UserContext';

export default function PerfilScreen() {
  const { theme } = useTheme();
  const { user } = useUser();
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) {
    return;
  }

  return (
    <View style={styles.container}>
      <ShowUserInfo user={user} />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.text.error }]}
        onPress={handleLogout}
      >
        <StyledText style={[styles.buttonText, { color: theme.text.light }]}>
          Cerrar Sesión
        </StyledText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    minWidth: '100%',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
