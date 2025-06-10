import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { partidoService } from '../services/partidoService';
import { Partido } from '../types/Partido';
import { Competicion } from '../types/Competicion';
import { Jornada } from '../types/Jornada';

export function usePartidos(jornada: Jornada, competicion: Competicion) {
  const { temporada } = useTemporadaContext();
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jornadaId = jornada.id;
  const competicionId = competicion.id;

  useEffect(() => {
    if (!temporada || !jornadaId || !competicionId) return;
    const fetch = async () => {
      setLoading(true);
      const res = await partidoService.getAllByJornada(
        temporada.id,
        competicionId,
        jornadaId
      );
      if (res.success && res.data) {
        setPartidos(res.data);
      } else {
        setError(res.errorMessage || 'Error al obtener partidos');
      }
      setLoading(false);
    };
    fetch();
  }, [temporada?.id, jornadaId, competicionId]);

  return { partidos, loading, error, refetch: () => fetch };
}
