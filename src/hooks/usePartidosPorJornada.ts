// src/hooks/usePartidosPorJornada.ts
import { useState } from 'react';
import { Partido } from '../types/Partido';
import { partidoService } from '../services/partidoService';
import { useTemporadaContext } from '../contexts/TemporadaContext';

export function usePartidosPorJornada() {
  const { temporada } = useTemporadaContext();
  const [partidosPorJornada, setPartidosPorJornada] = useState<
    Record<string, Partido[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Método que siempre fuerza la petición
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

        // Prioridad 1: Si uno es "descansa", va al final
        if (esDescansaA && !esDescansaB) return 1;
        if (!esDescansaA && esDescansaB) return -1;

        // Prioridad 2: Ordenar por fecha (si ambos tienen o ambos no tienen)
        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
        return fechaA - fechaB;
      });
      setPartidosPorJornada((prev) => ({
        ...prev,
        [jornadaId]: partidosOrdenados,
      }));
      setLoading(false);
      return partidosOrdenados;
    } else {
      setError(res.errorMessage ?? 'Error al obtener partidos');
      setLoading(false);
      return [];
    }
  };

  // Método que solo los obtiene si aún no están cacheados
  const obtenerPartidosSiNoExisten = async (jornadaId: string) => {
    if (!partidosPorJornada[jornadaId]) {
      await getPartidos(jornadaId);
    }
  };

  return {
    partidosPorJornada,
    getPartidos,
    obtenerPartidosSiNoExisten,
    loading,
    error,
  };
}
