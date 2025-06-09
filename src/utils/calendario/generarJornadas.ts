import { jornadaService } from '../../services/jornadaService';
import { partidoService } from '../../services/partidoService';
import { EstadoJornada, Jornada } from '../../types/Jornada';
import { Partido } from '../../types/Partido';
import { getRandomUID } from '../getRandomUID';

const ligaId = 'liga-regular';

export async function generarCalendarioLiga(
  temporadaId: string,
  equiposOriginales: { id: string; nombre: string; escudoUrl: string }[],
  onProgress?: (text: string) => void
): Promise<{
  jornadas: Jornada[];
  partidosPorJornada: Record<string, Partido[]>;
}> {
  // Copiamos equipos y añadimos "descansa" si es impar
  const equipos = [...equiposOriginales];
  if (equipos.length % 2 !== 0) {
    equipos.push({ id: 'descansa', nombre: 'Descansa', escudoUrl: '' });
  }

  const n = equipos.length; // total equipos (ya par)
  const rondas = n - 1; // jornadas ida
  const mitad = n / 2; // partidos por jornada

  const jornadas: Jornada[] = [];
  const partidosPorJornadaMap: Record<string, Partido[]> = {};

  // ➤ Generar CALENDARIO IDA
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

    // Emparejamientos
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

    // Guardar en BD
    await jornadaService.crear(temporadaId, ligaId, jornada);
    for (const p of partidosPorJornadaMap[jornadaId]) {
      await partidoService.crear(temporadaId, ligaId, p);
    }

    // Rotación: fija posición 0, mueve último equipo a índice 1
    const ultimo = equipos.pop()!;
    equipos.splice(1, 0, ultimo);
  }

  // ➤ Generar CALENDARIO VUELTA (invertir local/visitante)
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

    // Tomar partidos de la ida y voltear
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

    // Guardar en BD
    await jornadaService.crear(temporadaId, ligaId, jornada);
    for (const p of partidosPorJornadaMap[jornadaId]) {
      await partidoService.crear(temporadaId, ligaId, p);
    }
  }

  return {
    jornadas,
    partidosPorJornada: partidosPorJornadaMap,
  };
}
