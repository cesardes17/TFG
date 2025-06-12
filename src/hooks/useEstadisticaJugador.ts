import { useEffect, useState } from 'react';
import { EstadisticasSimpleJugador } from '../types/estadisticas/jugador';
import { jugadorEstadisticasService } from '../services/jugadorEstadisticasService';

export function useEstadisticasJugador(
  jugadorId: string,
  temporadaId?: string
) {
  const [estadisticasLiga, setEstadisticasLiga] =
    useState<EstadisticasSimpleJugador | null>(null);
  const [estadisticasCopa, setEstadisticasCopa] =
    useState<EstadisticasSimpleJugador | null>(null);
  const [estadisticasPlayoff, setEstadisticasPlayoff] =
    useState<EstadisticasSimpleJugador | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!temporadaId) return;

    const fetchEstadisticas = async () => {
      setLoading(true);
      try {
        const res =
          await jugadorEstadisticasService.getEstadisticasJugadorPorTemporada(
            jugadorId,
            temporadaId
          );

        if (!res.success) {
          throw new Error(res.errorMessage);
        }

        const data = res.data;

        // Separar cada tipo de estadística (o null si no existe)

        if (
          data?.estadisticasLiga &&
          data.estadisticasLiga.partidosJugados > 0
        ) {
          setEstadisticasLiga(data.estadisticasLiga);
        } else {
          setEstadisticasLiga(null);
        }

        if (
          data?.estadisticasCopa &&
          data.estadisticasCopa.partidosJugados > 0
        ) {
          setEstadisticasCopa(data.estadisticasCopa);
        } else {
          setEstadisticasCopa(null);
        }
        if (
          data?.estadisticasPlayoff &&
          data.estadisticasPlayoff.partidosJugados > 0
        ) {
          setEstadisticasPlayoff(data.estadisticasPlayoff);
        } else {
          setEstadisticasPlayoff(null);
        }
      } catch (error) {
        setErrorMsg(
          error instanceof Error
            ? error.message
            : 'Error al obtener estadísticas'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [jugadorId, temporadaId]);

  return {
    estadisticasLiga,
    estadisticasCopa,
    estadisticasPlayoff,
    loading,
    errorMsg,
  };
}
