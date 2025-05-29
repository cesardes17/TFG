import { StyleSheet, View } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { Rol } from '../../types/User';
import StyledButton from '../common/StyledButton';
import { router } from 'expo-router';
import { TipoCompeticion } from '../../types/Competicion';

interface AccionesPartidoProps {
  partidoId: string;
  tipoCompeticion: TipoCompeticion;
}

export default function AccionesPartido({
  partidoId,
  tipoCompeticion,
}: AccionesPartidoProps) {
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
            router.push({
              pathname: '/editarPartido/[id]',
              params: {
                id: partidoId,
                tipoCompeticion: tipoCompeticion,
              },
            });
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
