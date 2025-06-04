import { useState } from 'react';
import { Partido } from '../types/Partido';
import { partidoService } from '../services/partidoService';
import { useTemporadaContext } from '../contexts/TemporadaContext';

export function usePartidosPorJornada() {
  const { temporada } = useTemporadaContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Siempre se pide a la base de datos, no se cachea en memoria
  const getPartidos = async (jornadaId: string): Promise<Partido[]> => {
    if (!temporada) return [];

    setLoading(true);
    setError(null);

    const res = await partidoService.getAllByJornada(
      temporada.id,
      'liga-regular',
      jornadaId
    );

    if (res.success && res.data) {
      const partidosOrdenados = [...res.data!].sort((a, b) => {
        const esDescansaA =
          a.equipoLocal.nombre === 'Descansa' ||
          a.equipoVisitante.nombre === 'Descansa';
        const esDescansaB =
          b.equipoLocal.nombre === 'Descansa' ||
          b.equipoVisitante.nombre === 'Descansa';

        if (esDescansaA && !esDescansaB) return 1;
        if (!esDescansaA && esDescansaB) return -1;

        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
        return fechaA - fechaB;
      });

      setLoading(false);
      return partidosOrdenados;
    } else {
      setError(res.errorMessage ?? 'Error al obtener partidos');
      setLoading(false);
      return [];
    }
  };

  return {
    getPartidos,
    loading,
    error,
  };
}
