import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { partidoService } from '../services/partidoService';
import { Partido } from '../types/Partido';
import { Competicion } from '../types/Competicion';
import { Jornada } from '../types/Jornada';

export function usePartidos(
  jornada: Jornada | null,
  competicion: Competicion | null
) {
  const { temporada } = useTemporadaContext();
  const [partidos, setPartidos] = useState<Partido[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    if (!temporada || !jornada?.id || !competicion?.id) return;

    setLoading(true);
    const res = await partidoService.getAllByJornada(
      temporada.id,
      competicion.id,
      jornada.id
    );
    if (res.success && res.data) {
      setPartidos(res.data);
    } else {
      setError(res.errorMessage || 'Error al obtener partidos');
      setPartidos(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [temporada, jornada, competicion]);

  return { partidos, loading, error, fetch };
}
