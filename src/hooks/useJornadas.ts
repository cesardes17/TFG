// src/hooks/useJornadas.ts
import { useEffect, useState } from 'react';
import { Jornada } from '../types/Jornada';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { jornadaService } from '../services/jornadaService';
import { Competicion } from '../types/Competicion';

export function useJornadas(competicion: Competicion | null) {
  const { temporada } = useTemporadaContext();
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!temporada || !competicion) return;
    const fetch = async () => {
      setLoading(true);
      const res = await jornadaService.getAll(temporada.id, competicion.id);
      if (res.success && res.data) {
        setJornadas(res.data.sort((a, b) => a.numero - b.numero));
      } else {
        setJornadas([]);
        setError(res.errorMessage || 'Error al obtener jornadas');
      }
      setLoading(false);
    };
    fetch();
  }, [temporada?.id, competicion]);

  return { jornadas, loading, error };
}
