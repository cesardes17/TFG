// src/hooks/useVerificarSolicitudes.ts
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { User } from '../types/User';
import { BaseSolicitudService } from '../services/solicitudesService';
import { useTemporadaContext } from '../contexts/TemporadaContext';

export function useVerificarSolicitudes() {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const [contador, setContador] = useState(0);

  useEffect(() => {
    if (!user || !temporada) return;

    const cargarSolicitudes = async () => {
      let total = 0;

      if (user.rol === 'organizador' || user.rol === 'coorganizador') {
        const adminCount =
          await BaseSolicitudService.contarSolicitudesPendientesAdmin(
            temporada.id
          );
        total += adminCount;
      } else {
        const objetivoCount =
          await BaseSolicitudService.contarSolicitudesObjetivo(
            temporada.id,
            user.uid
          );
        total += objetivoCount;

        const solicitanteCount =
          await BaseSolicitudService.contarSolicitudesNoVistasSolicitante(
            temporada.id,
            user.uid
          );
        total += solicitanteCount;
      }

      setContador(total);
    };

    cargarSolicitudes();
  }, [user]);

  return contador;
}
