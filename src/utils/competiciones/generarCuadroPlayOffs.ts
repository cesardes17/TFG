// src/utils/generarCuadroPlayoffs.ts
import { getRandomUID } from '../getRandomUID';
import { Jornada } from '../../types/Jornada';
import { Serie } from '../../types/Serie';
import { Partido } from '../../types/Partido';
import { jornadaService } from '../../services/jornadaService';
import { partidoService } from '../../services/partidoService';
import { serieService } from '../../services/serieService';

type EquipoSimple = { id: string; nombre: string; escudoUrl: string };

interface CuadroPlayoffsResult {
  rondas: Jornada[];
  seriesPorRonda: Record<string, Serie[]>;
  partidosPorSerie: Record<string, Partido[]>;
}

export async function generarCuadroPlayoffs(
  temporadaId: string,
  competicionId: string,
  equiposOriginales: EquipoSimple[]
): Promise<CuadroPlayoffsResult> {
  const equipos = [...equiposOriginales];
  while (equipos.length < 8) {
    equipos.push({ id: 'bye', nombre: 'DESCANSA', escudoUrl: '' });
  }

  // Crear las rondas
  const rondaFinal: Jornada = {
    id: getRandomUID(),
    nombre: 'Final',
    numero: 3,
    estado: 'pendiente',
  };
  const rondaSemis: Jornada = {
    id: getRandomUID(),
    nombre: 'Semifinales',
    numero: 2,
    estado: 'pendiente',
  };
  const rondaCuartos: Jornada = {
    id: getRandomUID(),
    nombre: 'Cuartos de Final',
    numero: 1,
    estado: 'pendiente',
  };

  const rondas = [rondaCuartos, rondaSemis, rondaFinal];
  for (const ronda of rondas) {
    await jornadaService.crear(temporadaId, competicionId, ronda);
  }

  const seriesPorRonda: Record<string, Serie[]> = {};
  const partidosPorSerie: Record<string, Partido[]> = {};

  // 1️⃣ Crear la Final
  const finalSerie: Serie = {
    id: getRandomUID(),
    jornadaId: rondaFinal.id,
    temporadaId,
    tipoCompeticion: 'playoffs',
    local: { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' },
    visitante: { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' },
    partidosGanadosLocal: 0,
    partidosGanadosVisitante: 0,
    partidosJugados: 0,
    maxPartidos: 3,
    estado: 'pendiente',
    createdAt: new Date(),
  };
  await serieService.crear(temporadaId, competicionId, finalSerie);
  seriesPorRonda[rondaFinal.id] = [finalSerie];

  // 2️⃣ Crear las Semifinales apuntando a la Final
  const seriesSemis: Serie[] = [];
  for (let i = 0; i < 2; i++) {
    const semiSerie: Serie = {
      id: getRandomUID(),
      jornadaId: rondaSemis.id,
      temporadaId,
      tipoCompeticion: 'playoffs',
      local: { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' },
      visitante: { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' },
      partidosGanadosLocal: 0,
      partidosGanadosVisitante: 0,
      partidosJugados: 0,
      maxPartidos: 3,
      estado: 'pendiente',
      createdAt: new Date(),
      nextSerieId: finalSerie.id,
    };
    await serieService.crear(temporadaId, competicionId, semiSerie);
    seriesSemis.push(semiSerie);
  }
  seriesPorRonda[rondaSemis.id] = seriesSemis;

  // 3️⃣ Crear los Cuartos apuntando a las Semifinales correctas
  const cuartosASemisMap: Record<number, number> = {
    0: 0, // 1° vs 8° → semi 1
    3: 0, // 4° vs 5° → semi 1
    1: 1, // 2° vs 7° → semi 2
    2: 1, // 3° vs 6° → semi 2
  };

  const seriesCuartos: Serie[] = [];
  for (let i = 0; i < 4; i++) {
    const local = equipos[i];
    const visitante = equipos[7 - i];
    const semifinalIndex = cuartosASemisMap[i];

    const serieCuartos: Serie = {
      id: getRandomUID(),
      jornadaId: rondaCuartos.id,
      temporadaId,
      tipoCompeticion: 'playoffs',
      local,
      visitante,
      partidosGanadosLocal: 0,
      partidosGanadosVisitante: 0,
      partidosJugados: 0,
      maxPartidos: 3,
      estado:
        local.id === 'bye' || visitante.id === 'bye'
          ? 'finalizada'
          : 'pendiente',
      createdAt: new Date(),
      nextSerieId: seriesSemis[semifinalIndex].id,
    };

    await serieService.crear(temporadaId, competicionId, serieCuartos);
    seriesCuartos.push(serieCuartos);

    // Si hay bye, avanzar automáticamente
    if (local.id === 'bye' || visitante.id === 'bye') {
      const winner = local.id === 'bye' ? visitante : local;
      await serieService.actualizar(
        temporadaId,
        competicionId,
        serieCuartos.id,
        {
          estado: 'finalizada',
          ganadorId: winner.id,
        }
      );
      // Asignar en la semifinal
      const semiSerie = seriesSemis[semifinalIndex];
      if (semiSerie.local.id === 'por-definir') {
        semiSerie.local = winner;
      } else {
        semiSerie.visitante = winner;
      }
      await serieService.actualizar(
        temporadaId,
        competicionId,
        semiSerie.id,
        semiSerie
      );
    }

    // Crear dos partidos iniciales para cada serie de cuartos
    const partidos: Partido[] = [];
    for (let game = 1; game <= 2; game++) {
      const partido: Partido = {
        id: getRandomUID(),
        jornadaId: rondaCuartos.id,
        serieId: serieCuartos.id,
        tipoCompeticion: 'playoffs',
        equipoLocal: local,
        equipoVisitante: visitante,
        estado:
          serieCuartos.estado === 'finalizada' ? 'finalizado' : 'pendiente',
      };
      partidos.push(partido);
      await partidoService.crear(temporadaId, competicionId, partido);
    }
    partidosPorSerie[serieCuartos.id] = partidos;
  }
  seriesPorRonda[rondaCuartos.id] = seriesCuartos;

  return { rondas, seriesPorRonda, partidosPorSerie };
}
