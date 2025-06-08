import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Clasificacion } from '../types/Clasificacion';
import { clasificacionService } from '../services/clasificacionService';
import { useTemporadaContext } from '../contexts/TemporadaContext';

export function useClasificacion() {
  const { temporada } = useTemporadaContext();
  const [clasificacion, setClasificacion] = useState<Clasificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasificacion = useCallback(async () => {
    if (!temporada) return;

    setLoading(true);
    setError(null);

    const res = await clasificacionService.get(temporada.id, 'liga-regular');

    if (res.success && res.data) {
      setClasificacion(res.data);
    } else {
      setError(res.errorMessage ?? 'Error al obtener la clasificación');
    }

    setLoading(false);
  }, [temporada]);

  useFocusEffect(
    useCallback(() => {
      fetchClasificacion();
    }, [fetchClasificacion])
  );

  return { clasificacion, loading, error, refetch: fetchClasificacion };
}
