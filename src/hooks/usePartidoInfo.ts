// src/hooks/usePartidoInfo.ts
import { useEffect, useState } from 'react';
import { Partido, PartidoRT } from '../types/Partido';
import { partidoService } from '../services/partidoService';
import { useTemporadaContext } from '../contexts/TemporadaContext';

export default function usePartidoInfo(
  partidoId: string,
  tipoCompeticion: string // si lo necesitas
) {
  const [partido, setPartido] = useState<Partido | PartidoRT | null>(null);
  const [cuartoActual, setCuartoActual] = useState<string | null>(null);
  const [minutoActual, setMinutoActual] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { temporada } = useTemporadaContext();
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchPartido = async () => {
      setIsLoading(true);
      setError(null);

      // 1️⃣ Obtenemos el partido de Firestore
      const resFirestore = await partidoService.getPartido(
        temporada!.id,
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

      // 2️⃣ Si el partido está "en-juego", nos suscribimos en RTDB
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
        // Si no está en vivo, reiniciamos estos datos
        setCuartoActual(null);
        setMinutoActual(null);
      }

      setIsLoading(false);
    };

    fetchPartido();

    // Cleanup de la suscripción
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [partidoId, tipoCompeticion]);

  return {
    partido,
    cuartoActual,
    minutoActual,
    isLoading,
    error,
  };
}
