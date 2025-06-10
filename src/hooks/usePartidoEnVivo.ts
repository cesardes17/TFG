// usePartidoEnVivo.ts
import { useEffect, useState } from 'react';
import { partidoService } from '../services/partidoService';
import { PartidoRT } from '../types/Partido';

export default function usePartidoEnVivo(
  partidoId: string,
  esEnJuego: boolean,
  onFinalizado: () => void
) {
  const [partidoEnVivo, setPartidoEnVivo] = useState<PartidoRT | null>(null);

  useEffect(() => {
    // Si ya no está “en juego”, reseteamos y salimos
    if (!esEnJuego) {
      setPartidoEnVivo(null);
      return;
    }

    let unsubscribe: (() => void) | null = null;
    const suscribirse = async () => {
      unsubscribe = await partidoService.onPartidoRealtime(
        partidoId,
        (partido) => {
          // 1) Si el nodo desaparece
          if (!partido) {
            setPartidoEnVivo(null);
            return;
          }

          // 2) Si el partido acaba de pasar a “finalizado”
          if (partido.estado === 'finalizado') {
            // opcional: guarda la última info final antes de desmontar
            setPartidoEnVivo(partido);
            onFinalizado();
            return;
          }

          // 3) Estado normal “en-juego”
          setPartidoEnVivo(partido);
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
