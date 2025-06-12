import { useEffect, useCallback, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { competitionBaseService } from '../services/competicionService/baseService';
import { jornadaService } from '../services/jornadaService';
import { partidoService } from '../services/partidoService';
import { useFocusEffect } from 'expo-router';
import { Partido } from '../types/Partido';
import { Jornada } from '../types/Jornada';
import { Competicion } from '../types/Competicion';
import { Platform } from 'react-native';

export default function usePartidosJornadaActual() {
  const { temporada } = useTemporadaContext();
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [isLoadingPartidos, setIsLoadingPartidos] = useState<boolean>(false);
  const [errorPartidos, setErrorPartidos] = useState<string | null>(null);
  const [jornadaActual, setJornadaActual] = useState<Jornada | null>(null);
  const [competicionActual, setCompeticionActual] =
    useState<Competicion | null>(null);

  const getPartidosJornadaActual = useCallback(async () => {
    setIsLoadingPartidos(true);
    setErrorPartidos(null);
    try {
      if (!temporada) return;

      const resCompeticionActual =
        await competitionBaseService.getCompeticionEnCurso(temporada.id);

      if (!resCompeticionActual.success || !resCompeticionActual.data) {
        setErrorPartidos(
          resCompeticionActual.errorMessage ||
            'Error al obtener la competición en curso.'
        );
        return;
      }

      setCompeticionActual(resCompeticionActual.data);

      const resJornadaActual = await jornadaService.getJornadaActual(
        temporada.id,
        resCompeticionActual.data.id
      );

      if (!resJornadaActual.success || !resJornadaActual.data) {
        setErrorPartidos(
          resJornadaActual.errorMessage || 'Error al obtener la jornada actual.'
        );
        return;
      }

      setJornadaActual(resJornadaActual.data);

      const resPartidos = await partidoService.getAllByJornada(
        temporada.id,
        resCompeticionActual.data.id,
        resJornadaActual.data.id
      );

      if (!resPartidos.success || !resPartidos.data) {
        setErrorPartidos(
          resPartidos.errorMessage || 'Error al obtener los partidos.'
        );
        return;
      }

      setPartidos(resPartidos.data);
    } catch (error: any) {
      setErrorPartidos(error.message || 'Error desconocido');
    } finally {
      setIsLoadingPartidos(false);
    }
  }, [temporada]);

  // Móvil
  useFocusEffect(
    useCallback(() => {
      getPartidosJornadaActual();
    }, [getPartidosJornadaActual])
  );

  // Web
  useEffect(() => {
    if (Platform.OS === 'web') {
      getPartidosJornadaActual();
    }
  }, [getPartidosJornadaActual]);

  return {
    partidos,
    jornadaActual,
    competicionActual,
    isLoadingPartidos,
    errorPartidos,
    getPartidosJornadaActual,
  };
}
