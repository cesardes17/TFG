// src/hooks/useJornadas.ts
import { useEffect, useState } from 'react';
import { Jornada } from '../types/Jornada';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { jornadaService } from '../services/jornadaService';

export function useJornadas() {
  const { temporada } = useTemporadaContext();
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJornadas = async () => {
      if (!temporada) return;
      setLoading(true);
      setError(null);

      const res = await jornadaService.getAll(temporada.id, 'liga-regular');
      if (res.success && res.data) {
        const ordenadas = res.data.sort((a, b) => a.numero - b.numero);
        setJornadas(ordenadas);
      } else {
        setError(res.errorMessage ?? 'Error al obtener jornadas');
      }

      setLoading(false);
    };

    fetchJornadas();
  }, [temporada]);

  return { jornadas, loading, error };
}
