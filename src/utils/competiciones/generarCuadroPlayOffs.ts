// src/utils/generarCuadroPlayoffs.ts
import { getRandomUID } from '../getRandomUID';
import { Jornada } from '../../types/Jornada';
import { Serie } from '../../types/Serie';
import { Partido } from '../../types/Partido';
import { jornadaService } from '../../services/jornadaService';
import { partidoService } from '../../services/partidoService';
import { serieService } from '../../services/serieService';

// Tipo simplificado para equipos
type EquipoSimple = { id: string; nombre: string; escudoUrl: string };

interface CuadroPlayoffsResult {
  rondas: Jornada[];
  seriesPorRonda: Record<string, Serie[]>;
  partidosPorSerie: Record<string, Partido[]>;
}

/**
 * Genera un cuadro de Playoffs al mejor de tres partidos (serie).
 * - Usa el ranking de equipos para emparejar: 1 vs 8, 2 vs 7, etc.
 * - Agrega 'bye' para completar hasta 8 si faltan equipos.
 * - Crea 3 rondas: Cuartos, Semis, Final.
 * - Para cada serie, crea un documento Serie y dos Partidos iniciales apuntando a esa serie.
 * - Si tras dos partidos nadie alcanza 2 victorias, el tercer partido se genera dinámicamente en PlayoffService.
 * - Si hay 'bye', marca la serie como finalizada y asigna ganador automáticamente.
 */
export async function generarCuadroPlayoffs(
  temporadaId: string,
  competicionId: string,
  equiposOriginales: EquipoSimple[]
): Promise<CuadroPlayoffsResult> {
  // 1️⃣ Preparar equipos y rondas
  const equipos = [...equiposOriginales];
  while (equipos.length < 8) {
    equipos.push({ id: 'bye', nombre: 'DESCANSA', escudoUrl: '' });
  }

  const nombresRondas = ['Cuartos de Final', 'Semifinales', 'Final'];
  const rondas: Jornada[] = nombresRondas.map((nombre, idx) => ({
    id: getRandomUID(),
    nombre,
    numero: idx + 1,
    estado: 'pendiente',
  }));

  // Crear documentos de jornadas/rondas en Firestore
  for (const ronda of rondas) {
    await jornadaService.crear(temporadaId, competicionId, ronda);
  }

  const seriesPorRonda: Record<string, Serie[]> = {};
  const partidosPorSerie: Record<string, Partido[]> = {};

  // 2️⃣ Generar series y partidos iniciales por ronda
  for (let roundIndex = 0; roundIndex < rondas.length; roundIndex++) {
    const ronda = rondas[roundIndex];
    const nextRonda = rondas[roundIndex + 1];
    const numSeries = 2 ** (rondas.length - roundIndex - 1);

    seriesPorRonda[ronda.id] = [];

    for (let i = 0; i < numSeries; i++) {
      // Determinar participantes
      let local: EquipoSimple;
      let visitante: EquipoSimple;

      if (roundIndex === 0) {
        local = equipos[i];
        visitante = equipos[8 - 1 - i];
      } else {
        local = { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' };
        visitante = { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' };
      }

      // Crear Serie
      const serie: Serie = {
        id: getRandomUID(),
        jornadaId: ronda.id,
        temporadaId,
        tipoCompeticion: 'playoffs',
        local,
        visitante,
        partidosGanadosLocal: 0,
        partidosGanadosVisitante: 0,
        partidosJugados: 0,
        maxPartidos: 3,
        estado: 'pendiente',
        createdAt: new Date(),
        ...(nextRonda && { nextSerieId: getRandomUID() }),
      };
      seriesPorRonda[ronda.id].push(serie);
      await serieService.crear(temporadaId, competicionId, serie);

      // Manejo de bye: avance automático
      if (serie.local.id === 'bye' || serie.visitante.id === 'bye') {
        const winnerId =
          serie.local.id === 'bye' ? serie.visitante.id : serie.local.id;
        serie.estado = 'finalizada';
        serie.ganadorId = winnerId;
        serie.partidosJugados = 0;
        await serieService.actualizar(temporadaId, competicionId, serie.id, {
          estado: serie.estado,
          ganadorId: winnerId,
        });
      }

      // Crear dos partidos iniciales para la serie
      const partidos: Partido[] = [];
      for (let game = 1; game <= 2; game++) {
        const partido: Partido = {
          id: getRandomUID(),
          jornadaId: ronda.id,
          serieId: serie.id,
          tipoCompeticion: 'playoffs',
          equipoLocal: serie.local,
          equipoVisitante: serie.visitante,
          estado: serie.estado === 'finalizada' ? 'finalizado' : 'pendiente',
        };
        partidos.push(partido);
        await partidoService.crear(temporadaId, competicionId, partido);
      }
      partidosPorSerie[serie.id] = partidos;
    }
  }

  return { rondas, seriesPorRonda, partidosPorSerie };
}
