import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { Competicion } from '../types/Competicion';
import { FirestoreService } from '../services/core/firestoreService';

export type EstadoCompeticiones = {
  liga: {
    created: boolean;
    finalized: boolean;
    data?: Competicion;
  };
  copa: {
    created: boolean;
    finalized: boolean;
    data?: Competicion;
  };
  playoffs: {
    created: boolean;
    finalized: boolean;
    data?: Competicion;
  };
};

export function useCompeticiones() {
  const { temporada } = useTemporadaContext();
  const [competicionesEstado, setCompeticionesEstado] =
    useState<EstadoCompeticiones>({
      liga: { created: false, finalized: false },
      copa: { created: false, finalized: false },
      playoffs: { created: false, finalized: false },
    });
  const [loadingCompeticiones, setLoadingCompeticiones] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competiciones, setCompeticiones] = useState<Competicion[]>([]);
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
        const liga = res.data.find((c) => c.tipo === 'liga-regular');
        const copa = res.data.find((c) => c.tipo === 'copa');
        const playoffs = res.data.find((c) => c.tipo === 'playoffs');

        setCompeticionesEstado({
          liga: {
            created: !!liga,
            finalized: liga?.estado === 'finalizada' || false,
            data: liga,
          },
          copa: {
            created: !!copa,
            finalized: copa?.estado === 'finalizada' || false,
            data: copa,
          },
          playoffs: {
            created: !!playoffs,
            finalized: playoffs?.estado === 'finalizada' || false,
            data: playoffs,
          },
        });
        setCompeticiones(res.data);
      } else {
        setError(res.errorMessage || 'Error al obtener las competiciones');
      }

      setLoadingCompeticiones(false);
    };

    cargarCompeticiones();
  }, [temporada?.id]);

  return { competiciones, competicionesEstado, loadingCompeticiones, error };
}
