import { StyleSheet, View } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { Rol } from '../../types/User';
import StyledButton from '../common/StyledButton';
import { router } from 'expo-router';
import { TipoCompeticion } from '../../types/Competicion';
import { partidoService } from '../../services/partidoService';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useToast } from '../../contexts/ToastContext';

interface AccionesPartidoProps {
  partidoId: string;
  tipoCompeticion: TipoCompeticion;
}

export default function AccionesPartido({
  partidoId,
  tipoCompeticion,
}: AccionesPartidoProps) {
  const { user } = useUser();
  const { temporada } = useTemporadaContext();
  const { showToast } = useToast();
  if (user?.rol === 'arbitro') {
    return (
      <View style={styles.container}>
        <StyledButton
          title='Iniciar partido'
          onPress={async () => {
            const res = await partidoService.iniciarPartido(
              temporada!.id,
              tipoCompeticion,
              partidoId
            );
            if (res.success) {
              console.log('Iniciar partido');
              router.push({
                pathname: '/iniciarPartido/[id]',
                params: {
                  id: partidoId,
                  tipoCompeticion: tipoCompeticion,
                },
              });
            } else {
              showToast('No se pudo iniciar el partido', 'error');
            }
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
