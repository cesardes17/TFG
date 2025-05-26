// src/hooks/useCompeticiones.ts

import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { Competicion } from '../types/Competicion';
import { FirestoreService } from '../services/core/firestoreService';
import type { ResultService } from '../types/ResultService';

export function useCompeticiones() {
  const { temporada } = useTemporadaContext();
  const [competiciones, setCompeticiones] = useState<Competicion[]>([]);
  const [loadingCompetciones, setLoadingCompeticiones] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCompeticiones = async () => {
      if (!temporada) return;
      setLoadingCompeticiones(true);
      setError(null);
      const res = await FirestoreService.getCollectionByPath<Competicion>([
        'temporadas',
        temporada.id,
        'competiciones',
      ]);
      if (res.success && res.data) {
        setCompeticiones(res.data);
      } else {
        setError(res.errorMessage || 'Error al obtener las competiciones');
      }
      setLoadingCompeticiones(false);
    };

    cargarCompeticiones();
  }, [temporada?.id]);

  return { competiciones, loadingCompetciones, error };
}
