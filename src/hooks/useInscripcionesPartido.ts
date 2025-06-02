import { useEffect, useState } from 'react';
import { Inscripcion } from '../types/Inscripcion';
import { inscripcionesService } from '../services/inscripcionesService';

export function useInscripcionesPartido(
  temporadaId: string,
  equipoLocalId: string,
  equipoVisitanteId: string
) {
  const [inscripcionesLocal, setInscripcionesLocal] = useState<Inscripcion[]>(
    []
  );
  const [inscripcionesVisitante, setInscripcionesVisitante] = useState<
    Inscripcion[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInscripciones() {
      setIsLoading(true);
      setError(null);

      const resLocal = await inscripcionesService.getInscripcionesByTeam(
        temporadaId,
        equipoLocalId
      );
      const resVisitante = await inscripcionesService.getInscripcionesByTeam(
        temporadaId,
        equipoVisitanteId
      );

      if (!resLocal.success || !resVisitante.success) {
        setError(
          resLocal.errorMessage || resVisitante.errorMessage || 'Error general'
        );
      } else {
        setInscripcionesLocal(resLocal.data!);
        setInscripcionesVisitante(resVisitante.data!);
      }

      setIsLoading(false);
    }

    fetchInscripciones();
  }, [temporadaId, equipoLocalId, equipoVisitanteId]);

  return { inscripcionesLocal, inscripcionesVisitante, isLoading, error };
}
