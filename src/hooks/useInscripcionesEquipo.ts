// src/hooks/useInscripcionesEquipo.ts
import { useEffect, useState } from 'react';
import { Inscripcion } from '../types/Inscripcion';
import { inscripcionesService } from '../services/inscripcionesService';

export function useInscripcionesEquipo(
  temporadaId: string | undefined,
  equipoId: string
) {
  const [jugadores, setJugadores] = useState<Inscripcion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!temporadaId) return;

    const fetchInscripciones = async () => {
      setLoading(true);
      try {
        const res = await inscripcionesService.getInscripcionesByTeam(
          temporadaId,
          equipoId
        );
        if (!res.success) throw new Error(res.errorMessage);
        setJugadores(res.data!);
      } catch (error) {
        setErrorMsg(
          error instanceof Error
            ? error.message
            : 'Error al obtener inscripciones'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInscripciones();
  }, [temporadaId, equipoId]);

  return { jugadores, loading, errorMsg };
}
