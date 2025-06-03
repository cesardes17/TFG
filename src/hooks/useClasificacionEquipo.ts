// src/hooks/useClasificacionEquipo.ts
import { useEffect, useState } from 'react';
import { Clasificacion } from '../types/Clasificacion';
import { clasificacionService } from '../services/clasificacionService';

export default function useClasificacionEquipo(
  temporadaId: string | null,
  competicionId: string,
  equipoId: string
) {
  const [clasificacion, setClasificacion] = useState<Clasificacion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!temporadaId) return;

    const fetchClasificacion = async () => {
      setIsLoading(true);
      try {
        const res = await clasificacionService.get(temporadaId, competicionId);
        if (!res.success) {
          throw new Error(res.errorMessage);
        }

        // Filtrar la clasificación del equipo
        const clasificacionEquipo = res.data?.find(
          (c) => c.equipo.id === equipoId
        );
        setClasificacion(clasificacionEquipo || null);
      } catch (error) {
        setErrorMsg(
          error instanceof Error
            ? error.message
            : 'Error al obtener la clasificación'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasificacion();
  }, [temporadaId, competicionId, equipoId]);

  return { clasificacion, isLoading, errorMsg };
}
