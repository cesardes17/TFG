import { useCallback, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { Partido } from '../types/Partido';
import { partidoService } from '../services/partidoService';
import { useFocusEffect } from 'expo-router';

export default function usePartidosPorSerie(idSerie: string) {
  const { temporada } = useTemporadaContext();
  const [partidos, serPartidos] = useState<Partido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [partidosLoading, setPartidosLoading] = useState<boolean>(true);

  const fecthPartidos = async () => {
    setError(null);
    setPartidosLoading(true);
    try {
      const res = await partidoService.getAllBySerie(
        temporada!.id,
        'playoffs',
        idSerie
      );
      if (!res.success || !res.data) {
        throw new Error('Error al obtener los partidos');
      }
      serPartidos(res.data);
    } catch (error) {
      console.error(error);
      setError('Error al obtener los partidos');
    } finally {
      setPartidosLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fecthPartidos();
    }, [temporada, idSerie])
  );

  return { partidos, partidosLoading, error, fecthPartidos };
}
