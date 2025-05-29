import { StyleSheet, View } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { Rol } from '../../types/User';
import StyledButton from '../common/StyledButton';

export default function AccionesPartido() {
  const { user } = useUser();

  if (user?.rol === 'arbitro') {
    return (
      <View style={styles.container}>
        <StyledButton
          title='Iniciar partido'
          onPress={() => {
            console.log('Iniciar partido');
          }}
        />
      </View>
    );
  }

  if (user?.rol === 'organizador' || user?.rol === 'coorganizador') {
    return (
      <View style={styles.container}>
        <StyledButton
          title='Editar partido'
          onPress={() => {
            console.log('Editar partido');
          }}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 8,
  },
});
