import { StyleSheet, View } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { Rol, User } from '../../types/User';
import StyledButton from '../common/StyledButton';
import { router } from 'expo-router';
import { TipoCompeticion } from '../../types/Competicion';
import { partidoService } from '../../services/partidoService';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useToast } from '../../contexts/ToastContext';
import usePartido from '../../hooks/usePartido';
import { Partido } from '../../types/Partido';

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
  const { isLoading, partido } = usePartido(partidoId, tipoCompeticion);
  if (isLoading || !partido || !user) {
    return null;
  }

  if (
    esArbitroAsignado(partido, user) &&
    FaltaMenosDeMediaHora(partido.fecha)
  ) {
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

function esArbitroAsignado(partido: Partido, user: User) {
  let esArbitroAsignado = false;
  if (user.rol === 'arbitro') {
    esArbitroAsignado =
      partido.arbitro1?.id === user.uid ||
      partido.arbitro2?.id === user.uid ||
      partido.arbitro3?.id === user.uid;
  }
  return esArbitroAsignado;
}

function FaltaMenosDeMediaHora(fechaInicio?: Date) {
  if (!fechaInicio) {
    return false;
  }
  const fechaActual = new Date();
  const diferencia = fechaInicio.getTime() - fechaActual.getTime();
  const minutos = Math.floor(diferencia / 1000 / 60);
  return minutos < 30;
}
