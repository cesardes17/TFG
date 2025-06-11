import { useCallback, useEffect, useState } from 'react';
import { Competicion } from '../types/Competicion';
import { Serie } from '../types/Serie';
import { ResultService } from '../types/ResultService';
import { serieService } from '../services/serieService';
import { useTemporadaContext } from '../contexts/TemporadaContext';

interface UseSeriesResult {
  series: Serie[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

/**
 * Hook similar a usePartidosPorJornada, pero para Series de Playoffs
 */
export function useSeriesPorJornada(
  jornadaId: { id: string },
  competicion: Competicion
): UseSeriesResult {
  const { temporada } = useTemporadaContext();
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: ResultService<Serie[]> = await serieService.getAllByJornada(
        temporada!.id,
        competicion.tipo,
        jornadaId.id
      );
      if (res.success && res.data) {
        setSeries(res.data);
      } else {
        setError(res.errorMessage || 'Error al cargar series');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado al cargar series');
    }
    setLoading(false);
  }, [jornadaId.id, competicion.id, competicion.tipo]);

  useEffect(() => {
    if (!jornadaId.id) return;
    fetch();
  }, [jornadaId.id, competicion.id, competicion.tipo]);

  return { series, loading, error, fetch };
}
