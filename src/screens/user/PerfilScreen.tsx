import { View, TouchableOpacity, StyleSheet } from 'react-native';
import StyledText from '../../components/common/StyledText';
import { AuthService } from '../../services/authService';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

export default function PerfilScreen() {
  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StyledText>Pantalla Perfil</StyledText>
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
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
