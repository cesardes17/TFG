//src/utils/modoMesa/avanzarCuarto.ts:
export function avanzarCuarto(
  prev: string,
  puntosLocal: number,
  puntosVisitante: number
): string {
  if (prev === 'C1') return 'C2';
  if (prev === 'C2') return 'DESCANSO';
  if (prev === 'DESCANSO') return 'C3';
  if (prev === 'C3') return 'C4';

  if (prev === 'C4' || prev.startsWith('PR')) {
    if (puntosLocal === puntosVisitante) {
      if (prev.startsWith('`R')) {
        const num = parseInt(prev.replace('PR', ''), 10) || 1;
        return `PR${num + 1}`;
      } else {
        return 'PR1';
      }
    } else {
      return 'FINALIZADO';
    }
  }

  return prev;
}
