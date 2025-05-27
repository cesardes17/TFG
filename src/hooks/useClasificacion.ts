// src/hooks/useClasificacion.ts
import { useEffect, useState } from 'react';
import { Clasificacion } from '../types/Clasificacion';
import { FirestoreService } from '../services/core/firestoreService';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import type { ResultService } from '../types/ResultService';
import { clasificacionService } from '../services/clasificacionService';

export function useClasificacion() {
  const { temporada } = useTemporadaContext();
  const [clasificacion, setClasificacion] = useState<Clasificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasificacion = async () => {
      if (!temporada) return;

      setLoading(true);
      setError(null);

      const res = await clasificacionService.get(temporada.id, 'liga-regular');

      if (res.success) {
        // Orden secundaria si hay empate en puntos
        const ordenado = res.data!.sort((a, b) => {
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia;
          return a.equipo.nombre.localeCompare(b.equipo.nombre);
        });
        setClasificacion(ordenado);
      } else {
        setError(res.errorMessage ?? 'Error al obtener la clasificación');
      }

      setLoading(false);
    };

    fetchClasificacion();
  }, [temporada]);

  return { clasificacion, loading, error };
}
