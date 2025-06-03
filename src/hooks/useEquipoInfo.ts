// src/hooks/useEquipoInfo.ts
import { useEffect, useState } from 'react';
import { equipoService } from '../services/equipoService';
import { Equipo } from '../types/Equipo';

export function useEquipoInfo(
  temporadaId: string | undefined,
  equipoId: string
) {
  const [equipoInfo, setEquipoInfo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!temporadaId) return;

    const fetchEquipoInfo = async () => {
      setLoading(true);
      try {
        const equipoRes = await equipoService.getEquipo(temporadaId, equipoId);
        if (!equipoRes.success) throw new Error(equipoRes.errorMessage);
        setEquipoInfo(equipoRes.data!);
      } catch (error) {
        setErrorMsg(
          error instanceof Error ? error.message : 'Error al obtener el equipo'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEquipoInfo();
  }, [temporadaId, equipoId]);

  return { equipoInfo, loading, errorMsg };
}
