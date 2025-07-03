// src/utils/generarCuadroPlayoffs.ts
import { getRandomUID } from '../getRandomUID';
import { Jornada } from '../../types/Jornada';
import { Serie } from '../../types/Serie';
import { Partido } from '../../types/Partido';

type EquipoSimple = { id: string; nombre: string; escudoUrl: string };

interface CuadroPlayoffsResult {
  rondas: Jornada[];
  seriesPorRonda: Record<string, Serie[]>;
  partidosPorSerie: Record<string, Partido[]>;
}

export function generarCuadroPlayoffs(
  temporadaId: string,
  equiposOriginales: EquipoSimple[]
): CuadroPlayoffsResult {
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

  const seriesPorRonda: Record<string, Serie[]> = {};
  const partidosPorSerie: Record<string, Partido[]> = {};

  // 1️⃣ Final
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
  seriesPorRonda[rondaFinal.id] = [finalSerie];

  // 2️⃣ Semifinales
  const seriesSemis: Serie[] = [];
  for (let i = 0; i < 2; i++) {
    seriesSemis.push({
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
    });
  }
  seriesPorRonda[rondaSemis.id] = seriesSemis;

  // 3️⃣ Cuartos
  const cuartosASemisMap: Record<number, number> = {
    0: 0, // 1° vs 8°
    3: 0, // 4° vs 5°
    1: 1, // 2° vs 7°
    2: 1, // 3° vs 6°
  };

  const seriesCuartos: Serie[] = [];

  for (let i = 0; i < 4; i++) {
    const local = equipos[i];
    const visitante = equipos[7 - i];
    const semifinalIndex = cuartosASemisMap[i];
    const semifinal = seriesSemis[semifinalIndex];

    const isBye = local.id === 'bye' || visitante.id === 'bye';
    const estado = isBye ? 'finalizada' : 'pendiente';
    const ganador = local.id === 'bye' ? visitante : local;

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
      estado,
      createdAt: new Date(),
      nextSerieId: semifinal.id,
      ...(isBye ? { ganadorId: ganador.id } : {}),
    };
    seriesCuartos.push(serieCuartos);

    if (isBye) {
      // Insertar al ganador directamente en la semi
      if (semifinal.local.id === 'por-definir') {
        semifinal.local = ganador;
      } else {
        semifinal.visitante = ganador;
      }
    }

    // Generar 2 partidos
    const partidos: Partido[] = [];
    for (let j = 0; j < 2; j++) {
      partidos.push({
        id: getRandomUID(),
        jornadaId: rondaCuartos.id,
        serieId: serieCuartos.id,
        tipoCompeticion: 'playoffs',
        equipoLocal: local,
        equipoVisitante: visitante,
        estado: isBye ? 'finalizado' : 'pendiente',
      });
    }
    partidosPorSerie[serieCuartos.id] = partidos;
  }

  seriesPorRonda[rondaCuartos.id] = seriesCuartos;

  return { rondas, seriesPorRonda, partidosPorSerie };
}
