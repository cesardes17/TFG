import { useCallback, useEffect, useState } from 'react';
import { Serie } from '../types/Serie';
import { serieService } from '../services/serieService';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { useFocusEffect } from 'expo-router';

export default function useSerie(idSerie: string) {
  const { temporada } = useTemporadaContext();
  const [serie, setSerie] = useState<Serie | null>(null);
  const [errorSerie, setErrorSerie] = useState<string | null>(null);
  const [loadingSeries, setLoadingSerie] = useState<boolean>(true);
  const fetchSerie = async () => {
    setErrorSerie(null);
    setLoadingSerie(true);
    try {
      const res = await serieService.getSerie(
        temporada!.id,
        'playoffs',
        idSerie
      );
      if (!res.success || !res.data) {
        throw new Error(res.errorMessage || 'Error al obtener serie');
      }
      setSerie(res.data);
    } catch (error: any) {
      setErrorSerie(error.message || 'Error al obtener serie');
    } finally {
      setLoadingSerie(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (temporada) {
        fetchSerie();
      }
    }, [idSerie])
  );

  return {
    serie,
    errorSerie,
    loadingSeries,
    fetchSerie,
  };
}
