// src/hooks/usePartidoInfo.ts
import { useCallback, useEffect, useState } from 'react';
import { Partido, PartidoRT } from '../types/Partido';
import { partidoService } from '../services/partidoService';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { useFocusEffect } from 'expo-router';

/**
 * Hook para obtener información de un partido y sus actualizaciones en tiempo real.
 * Cuando el partido deja de estar "en-juego", realiza un fetch final para obtener datos actualizados.
 */
export default function usePartidoInfo(
  partidoId: string,
  tipoCompeticion: string
) {
  const { temporada } = useTemporadaContext();
  const [partido, setPartido] = useState<Partido | PartidoRT | null>(null);
  const [cuartoActual, setCuartoActual] = useState<string | null>(null);
  const [minutoActual, setMinutoActual] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar datos del partido desde Firestore
  const fetchPartido = useCallback(async () => {
    let unsubscribe: (() => void) | null = null;
    setIsLoading(true);
    setError(null);

    if (!temporada) {
      setError('Temporada no definida');
      setIsLoading(false);
      return;
    }

    const resFirestore = await partidoService.getPartido(
      temporada.id,
      tipoCompeticion,
      partidoId
    );

    if (!resFirestore.success || !resFirestore.data) {
      setError(resFirestore.errorMessage || 'Error al obtener el partido');
      setIsLoading(false);
      return;
    }

    const data = resFirestore.data;
    setPartido(data);
    setCuartoActual(null);
    setMinutoActual(null);

    // Suscripción en tiempo real sólo si está en juego
    if (data.estado === 'en-juego') {
      unsubscribe = await partidoService.onPartidoRealtime(
        partidoId,
        (realTimeData) => {
          if (realTimeData) {
            setPartido(realTimeData);
            setCuartoActual(realTimeData.cuartoActual || null);
            setMinutoActual(realTimeData.minutoActual || null);

            // Si el partido ya no está en juego, finalizamos la suscripción y hacemos un fetch final
            if (realTimeData.estado !== 'en-juego') {
              if (unsubscribe) unsubscribe();
              fetchPartido();
            }
          }
        }
      );
    }

    setIsLoading(false);
    return unsubscribe;
  }, [temporada, tipoCompeticion, partidoId]);

  // Efecto para carga inicial y limpieza
  useEffect(() => {
    let unsubscribe: (() => void) | null | undefined = null;

    (async () => {
      unsubscribe = await fetchPartido();
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchPartido]);

  // Refetch al enfocar pantalla
  useFocusEffect(
    useCallback(() => {
      let unsubscribe: (() => void) | null | undefined = null;
      (async () => {
        unsubscribe = await fetchPartido();
      })();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [fetchPartido])
  );

  return {
    partido,
    cuartoActual,
    minutoActual,
    isLoading,
    error,
    refetch: fetchPartido,
  };
}
