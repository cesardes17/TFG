// src/utils/generarCalendarioLiga.ts

import { jornadaService } from '../../services/jornadaService';
import { partidoService } from '../../services/partidoService';
import { EstadoJornada, Jornada } from '../../types/Jornada';
import { Partido } from '../../types/Partido';
import { getRandomUID } from '../getRandomUID';

const ligaId = 'liga-regular';

export async function generarCalendarioLiga(
  temporadaId: string,
  equipos: { id: string; nombre: string; escudoUrl: string }[],
  onProgress?: (text: string) => void
): Promise<{
  jornadas: Jornada[];
  partidosPorJornada: Record<string, Partido[]>;
}> {
  const numEquipos = equipos.length;
  const esImpar = numEquipos % 2 !== 0;

  const equiposCopia = [...equipos];
  if (esImpar) {
    equiposCopia.push({ id: 'descansa', nombre: 'Descansa', escudoUrl: '' });
  }

  const totalEquipos = equiposCopia.length; // ahora siempre par
  const totalJornadas = totalEquipos - 1;
  const partidosPorJornada = totalEquipos / 2;

  const jornadas: Jornada[] = [];
  const partidosPorJornadaMap: Record<string, Partido[]> = {};

  let equiposLocales = equiposCopia.slice(0, partidosPorJornada);
  let equiposVisitantes = equiposCopia.slice(partidosPorJornada).reverse();

  for (let ronda = 0; ronda < totalJornadas * 2; ronda++) {
    const numeroJornada = ronda + 1;
    const jornadaId = getRandomUID();
    const nombre = `Jornada ${numeroJornada}`;

    onProgress?.(`Generando jornada ${numeroJornada}`);

    const jornada: Jornada = {
      id: jornadaId,
      nombre,
      numero: numeroJornada,
      estado: 'pendiente' as EstadoJornada,
    };

    jornadas.push(jornada);
    partidosPorJornadaMap[jornadaId] = [];

    const esIda = ronda < totalJornadas;

    for (let i = 0; i < partidosPorJornada; i++) {
      const local = esIda ? equiposLocales[i] : equiposVisitantes[i];
      const visitante = esIda ? equiposVisitantes[i] : equiposLocales[i];
      const esDescansa = local.id === 'descansa' || visitante.id === 'descansa';
      const partido: Partido = {
        id: getRandomUID(),
        jornadaId,
        equipoLocal: local,
        equipoVisitante: visitante,
        estado: esDescansa ? 'finalizado' : 'pendiente',
        tipoCompeticion: 'liga-regular',
      };

      partidosPorJornadaMap[jornadaId].push(partido);
    }

    // Guardar jornada
    await jornadaService.crear(temporadaId, ligaId, jornada);

    // Guardar partidos
    for (const partido of partidosPorJornadaMap[jornadaId]) {
      await partidoService.crear(temporadaId, ligaId, partido);
    }

    // Rotar equipos
    if (ronda + 1 !== totalJornadas * 2) {
      const fijo = equiposLocales[0];
      const rotar = [...equiposLocales.slice(1), ...equiposVisitantes];

      equiposLocales = [fijo];
      equiposVisitantes = [];

      for (let i = 0; i < partidosPorJornada - 1; i++) {
        equiposLocales.push(rotar[i]);
      }
      for (let i = partidosPorJornada - 1; i < rotar.length; i++) {
        equiposVisitantes.push(rotar[i]);
      }

      equiposVisitantes.reverse();
    }
  }

  return {
    jornadas,
    partidosPorJornada: partidosPorJornadaMap,
  };
}
