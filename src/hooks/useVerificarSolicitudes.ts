import { useCallback, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { BaseSolicitudService } from '../services/solicitudesService';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { useFocusEffect } from '@react-navigation/native';

export function useVerificarSolicitudes() {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const [contador, setContador] = useState(0);

  const cargarSolicitudes = useCallback(async () => {
    if (!user || !temporada) return;

    let total = 0;

    if (user.rol === 'organizador' || user.rol === 'coorganizador') {
      const adminCount =
        await BaseSolicitudService.contarSolicitudesPendientesAdmin(
          temporada.id
        );
      total += adminCount;
    } else {
      console.log('Contar solicitudes de Jugador o Capitan');
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

      const afectadoCount =
        await BaseSolicitudService.contarSolicitudesNoVistasAfectado(
          temporada.id,
          user.uid
        );
      total += afectadoCount;
    }

    setContador(total);
  }, [user, temporada]);

  useFocusEffect(
    useCallback(() => {
      cargarSolicitudes();
    }, [cargarSolicitudes])
  );

  return contador;
}
