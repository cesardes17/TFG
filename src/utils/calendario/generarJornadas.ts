// utils/generarCalendarioLiga.ts

import { EstadoJornada, Jornada } from '../../types/Jornada';
import { Partido } from '../../types/Partido';
import { getRandomUID } from '../getRandomUID';

const ligaId = 'liga-regular';

export async function generarCalendarioLiga(
  equiposOriginales: { id: string; nombre: string; escudoUrl: string }[],
  onProgress?: (text: string) => void
): Promise<{
  jornadas: Jornada[];
  partidosPorJornada: Record<string, Partido[]>;
}> {
  const equipos = [...equiposOriginales];
  if (equipos.length % 2 !== 0) {
    equipos.push({ id: 'descansa', nombre: 'Descansa', escudoUrl: '' });
  }

  const n = equipos.length;
  const rondas = n - 1;
  const mitad = n / 2;

  const jornadas: Jornada[] = [];
  const partidosPorJornadaMap: Record<string, Partido[]> = {};

  for (let r = 0; r < rondas; r++) {
    const jornadaNum = r + 1;
    const jornadaId = getRandomUID();
    onProgress?.(`Generando ida: Jornada ${jornadaNum}`);

    const jornada: Jornada = {
      id: jornadaId,
      nombre: `Jornada ${jornadaNum}`,
      numero: jornadaNum,
      estado: 'pendiente' as EstadoJornada,
    };
    jornadas.push(jornada);
    partidosPorJornadaMap[jornadaId] = [];

    for (let i = 0; i < mitad; i++) {
      const local = equipos[i];
      const visitante = equipos[n - 1 - i];
      const esDescansa = local.id === 'descansa' || visitante.id === 'descansa';
      const partido: Partido = {
        id: getRandomUID(),
        jornadaId,
        equipoLocal: local,
        equipoVisitante: visitante,
        estado: esDescansa ? 'finalizado' : 'pendiente',
        tipoCompeticion: ligaId,
      };
      partidosPorJornadaMap[jornadaId].push(partido);
    }

    const ultimo = equipos.pop()!;
    equipos.splice(1, 0, ultimo);
  }

  for (let r = 0; r < rondas; r++) {
    const jornadaNum = rondas + r + 1;
    const jornadaId = getRandomUID();
    onProgress?.(`Generando vuelta: Jornada ${jornadaNum}`);

    const jornada: Jornada = {
      id: jornadaId,
      nombre: `Jornada ${jornadaNum}`,
      numero: jornadaNum,
      estado: 'pendiente' as EstadoJornada,
    };
    jornadas.push(jornada);
    partidosPorJornadaMap[jornadaId] = [];

    const idaJornadaId = jornadas[r].id;
    const partidosIda = partidosPorJornadaMap[idaJornadaId];
    for (const pIda of partidosIda) {
      const esDescansa =
        pIda.equipoLocal.id === 'descansa' ||
        pIda.equipoVisitante.id === 'descansa';
      const partido: Partido = {
        id: getRandomUID(),
        jornadaId,
        equipoLocal: pIda.equipoVisitante,
        equipoVisitante: pIda.equipoLocal,
        estado: esDescansa ? 'finalizado' : 'pendiente',
        tipoCompeticion: ligaId,
      };
      partidosPorJornadaMap[jornadaId].push(partido);
    }
  }

  return { jornadas, partidosPorJornada: partidosPorJornadaMap };
}
