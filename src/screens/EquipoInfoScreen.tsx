import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { equipoService } from '../services/equipoService';
import { Equipo } from '../types/Equipo';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import StyledAlert from '../components/common/StyledAlert';
import EquipoInfoCard from '../components/equipo/EquipoInfoCard';
import TablaJugadores from '../components/equipo/TablaJugadores';
import { Inscripcion } from '../types/Inscripcion';
import { inscripcionesService } from '../services/inscripcionesService';
import LoadingIndicator from '../components/common/LoadingIndicator';

interface EquipoInfoScreenProps {
  equipoId: string;
}

export default function EquipoInfoScreen({ equipoId }: EquipoInfoScreenProps) {
  const { temporada } = useTemporadaContext();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [equipoInfo, setEquipoInfo] = useState<Equipo | null>(null);
  const [jugadores, setJugadores] = useState<Inscripcion[] | null>(null);
  useEffect(() => {
    if (!temporada) return;
    const fetchEquipoInfo = async () => {
      setIsLoading(true);
      // TODO: fetch equipo info
      try {
        const equipoRes = await equipoService.getEquipo(temporada.id, equipoId);
        if (!equipoRes.success) {
          throw new Error(equipoRes.errorMessage);
        }
        const jugadores = await inscripcionesService.getInscripcionesByTeam(
          temporada.id,
          equipoId
        );
        if (!jugadores.success) {
          throw new Error(jugadores.errorMessage);
        }
        setJugadores(jugadores.data!);
        setEquipoInfo(equipoRes.data!);
        setIsLoading(false);
      } catch (error) {
        setErrorMsg(
          error instanceof Error
            ? error.message
            : 'Error al obtener la informacion del equipo'
        );
      }
    };
    fetchEquipoInfo();
  }, [temporada]);

  if (isLoading) {
    return <LoadingIndicator text='Cargando información...' />;
  }
  if (errorMsg || !equipoInfo || !jugadores) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StyledAlert
          variant='error'
          message={errorMsg || 'Error al obtener la informacion del equipo'}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <EquipoInfoCard
        nombre={equipoInfo.nombre}
        capitan={equipoInfo.capitan}
        escudoUrl={equipoInfo.escudoUrl}
      />

      <TablaJugadores players={jugadores} />
    </View>
  );
}
