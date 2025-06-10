// usePartidoEnVivo.ts
import { useEffect, useState } from 'react';
import { partidoService } from '../services/partidoService';
import { PartidoRT } from '../types/Partido';

export default function usePartidoEnVivo(
  partidoId: string,
  esEnJuego: boolean,
  onFinalizado?: () => void // 👈 callback opcional
) {
  const [partidoEnVivo, setPartidoEnVivo] = useState<PartidoRT | null>(null);

  useEffect(() => {
    if (!esEnJuego) {
      setPartidoEnVivo(null);
      return;
    }

    let unsubscribe: (() => void) | null = null;
    const suscribirse = async () => {
      unsubscribe = await partidoService.onPartidoRealtime(
        partidoId,
        (partido) => {
          setPartidoEnVivo(partido);
          // 🔥 Detectamos si el partido "desapareció" (finalizó en RTDB)
          if (!partido && onFinalizado) {
            onFinalizado();
          }
        }
      );
    };

    suscribirse();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [partidoId, esEnJuego, onFinalizado]);

  return partidoEnVivo;
}
