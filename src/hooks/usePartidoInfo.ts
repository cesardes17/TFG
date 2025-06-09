import { useCallback, useEffect, useState } from 'react';
import { Partido, PartidoRT } from '../types/Partido';
import { partidoService } from '../services/partidoService';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { useFocusEffect } from 'expo-router';

export default function usePartidoInfo(
  partidoId: string,
  tipoCompeticion: string
) {
  const [partido, setPartido] = useState<Partido | PartidoRT | null>(null);
  const [cuartoActual, setCuartoActual] = useState<string | null>(null);
  const [minutoActual, setMinutoActual] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { temporada } = useTemporadaContext();

  const fetchPartido = useCallback(async () => {
    let unsubscribe: (() => void) | null | undefined = null; // 👈 corregido aquí
    setIsLoading(true);
    setError(null);

    if (!temporada) return;

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

    const partidoFirestore = resFirestore.data;
    setPartido(partidoFirestore);

    if (partidoFirestore.estado === 'en-juego') {
      unsubscribe = await partidoService.onPartidoRealtime(
        partidoId,
        (partidoEnVivo) => {
          if (partidoEnVivo) {
            setPartido(partidoEnVivo);
            setCuartoActual(partidoEnVivo.cuartoActual || null);
            setMinutoActual(partidoEnVivo.minutoActual || null);
            console.log('Partido en vivo:', partidoEnVivo);
          }
        }
      );
    } else {
      setCuartoActual(null);
      setMinutoActual(null);
    }

    setIsLoading(false);

    return unsubscribe;
  }, [temporada, tipoCompeticion, partidoId]);

  useEffect(() => {
    let unsubscribe: (() => void) | null | undefined = null;

    const load = async () => {
      unsubscribe = await fetchPartido();
    };

    load();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchPartido]);

  useFocusEffect(
    useCallback(() => {
      let unsubscribe: (() => void) | null | undefined = null;

      const loadOnFocus = async () => {
        unsubscribe = await fetchPartido();
      };

      loadOnFocus();

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
