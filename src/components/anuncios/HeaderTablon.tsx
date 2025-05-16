import { TouchableOpacity } from 'react-native';
import StyledText from '../common/StyledText';
import { AddIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

export default function HeaderTablon() {
  const { theme } = useTheme();
  const { user } = useUser();

  const isAdmin =
    user?.role === 'organizador' || user?.role === 'coorganizador';

  if (!isAdmin) {
    return null;
  }
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        minWidth: '100%',
        borderRadius: 5,
      }}
      onPress={() => {
        router.push('/crearAnuncio');
      }}
    >
      <AddIcon color={theme.text.primary} size={24} />
      <StyledText>Crear Anuncio</StyledText>
    </TouchableOpacity>
  );
}
