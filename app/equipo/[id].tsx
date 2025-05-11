// src/app/equipo/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Equipo } from '../../src/types/Equipo';
import { Inscripcion } from '../../src/types/Inscripcion';
import { equipoService } from '../../src/services/equipoService';
import { useTemporadaContext } from '../../src/contexts/TemporadaContext';
import StyledAlert from '../../src/components/common/StyledAlert';
import HeaderConfig from '../../src/components/layout/HeaderConfig';
import { inscripcionesService } from '../../src/services/inscripcionesService';
import EquipoInfoScreen from '../../src/screens/EquipoInfoScreen';

export default function EquipoPage() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>(); // 1️⃣
  const { temporada } = useTemporadaContext();
  const [isLoading, setIsLoading] = useState(true);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [jugadores, setJugadores] = useState<Inscripcion[]>([]);
  const [error, setError] = useState('');
  const [errorJugador, seterrorJugador] = useState('');
  useEffect(() => {
    async function loadEquipo() {
      if (!temporada) return;
      try {
        const res = await equipoService.getEquipo(temporada.id, id);

        if (!res.success) {
          setError(res.errorMessage || 'Error al obtener el equipo.');
        } else {
          setEquipo(res.data!);
        }

        const resJugadores = await inscripcionesService.getInscripcionesByTeam(
          temporada.id,
          id
        );
        console.log(id);
        console.log('resjugadore ', resJugadores);
        if (!resJugadores.success || !resJugadores.data) {
          seterrorJugador(
            resJugadores.errorMessage ||
              'Error al obtener los jugadores del equipo'
          );
        } else {
          setJugadores(resJugadores.data);
        }

        console.log();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false); // 2️⃣
      }
    }
    loadEquipo();
  }, [id]);

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: 'center' }}
        size='large'
        color={theme.text.primary}
      />
    );
  }

  if (error !== '') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StyledAlert variant='error' message={error} />
      </View>
    );
  }

  return (
    <PageContainer>
      <HeaderConfig title={'Informacion de Equipo'} />
      <EquipoInfoScreen equipoId={id} />
    </PageContainer>
  );
}
