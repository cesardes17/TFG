// src/utils/generarCuadroCopa.ts
import { getRandomUID } from '../getRandomUID';
import { Jornada, EstadoJornada } from '../../types/Jornada';
import { Partido } from '../../types/Partido';
import { jornadaService } from '../../services/jornadaService';
import { partidoService } from '../../services/partidoService';

type EquipoSimple = { id: string; nombre: string; escudoUrl: string };

export async function generarCuadroCopa(
  temporadaId: string,
  competicionId: string,
  equiposOriginales: EquipoSimple[]
): Promise<{
  rondas: Jornada[];
  partidosPorRonda: Record<string, Partido[]>;
}> {
  console.log('equiposOriginales: ', equiposOriginales);

  const rondas: Jornada[] = [];
  const partidosPorRonda: Record<string, Partido[]> = {};

  // Asegurarse de tener 8 equipos (rellenar con bye si faltan)
  const equipos: EquipoSimple[] = [...equiposOriginales];
  while (equipos.length < 8) {
    equipos.push({ id: 'bye', nombre: 'DESCANSA', escudoUrl: '' });
  }

  // 1️⃣ Final
  const rondaFinal: Jornada = {
    id: getRandomUID(),
    nombre: 'Final',
    numero: 3,
    estado: 'pendiente',
  };
  rondas.push(rondaFinal);

  const partidoFinal: Partido = {
    id: getRandomUID(),
    jornadaId: rondaFinal.id,
    tipoCompeticion: 'copa',
    equipoLocal: { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' },
    equipoVisitante: {
      id: 'por-definir',
      nombre: 'Por Definir',
      escudoUrl: '',
    },
    estado: 'pendiente',
  };
  await partidoService.crear(temporadaId, competicionId, partidoFinal);
  await jornadaService.crear(temporadaId, competicionId, rondaFinal);
  partidosPorRonda[rondaFinal.id] = [partidoFinal];

  // 2️⃣ Semifinales
  const rondaSemis: Jornada = {
    id: getRandomUID(),
    nombre: 'Semifinales',
    numero: 2,
    estado: 'pendiente',
  };
  rondas.push(rondaSemis);

  const partidosSemis: Partido[] = [];
  for (let i = 0; i < 2; i++) {
    const partido: Partido = {
      id: getRandomUID(),
      jornadaId: rondaSemis.id,
      tipoCompeticion: 'copa',
      equipoLocal: { id: 'por-definir', nombre: 'Por Definir', escudoUrl: '' },
      equipoVisitante: {
        id: 'por-definir',
        nombre: 'Por Definir',
        escudoUrl: '',
      },
      estado: 'pendiente',
      siguientePartidoId: partidoFinal.id, // Todos apuntan a la final
    };
    partidosSemis.push(partido);

    await partidoService.crear(temporadaId, competicionId, partido);
  }
  await jornadaService.crear(temporadaId, competicionId, rondaSemis);
  partidosPorRonda[rondaSemis.id] = partidosSemis;

  // 3️⃣ Cuartos de final
  const rondaCuartos: Jornada = {
    id: getRandomUID(),
    nombre: 'Cuartos de Final',
    numero: 1,
    estado: 'pendiente',
  };
  rondas.push(rondaCuartos);

  const partidosCuartos: Partido[] = [];
  const equiposQuePasanASemis: EquipoSimple[] = [];

  // Lógica para asignar cada cuarto a la semifinal correcta
  // Mapeo: índice del partido de cuartos => índice del partido de semifinal
  const cuartosAsemisMap: Record<number, number> = {
    0: 0, // 1° vs 8° -> semifinal 1
    3: 0, // 4° vs 5° -> semifinal 1
    1: 1, // 2° vs 7° -> semifinal 2
    2: 1, // 3° vs 6° -> semifinal 2
  };

  for (let i = 0; i < 4; i++) {
    const local = equipos[i];
    const visitante = equipos[7 - i];
    const semifinalIndex = cuartosAsemisMap[i];

    const partido: Partido = {
      id: getRandomUID(),
      jornadaId: rondaCuartos.id,
      tipoCompeticion: 'copa',
      equipoLocal: local,
      equipoVisitante: visitante,
      estado:
        local.id === 'bye' || visitante.id === 'bye'
          ? 'finalizado'
          : 'pendiente',
      siguientePartidoId: partidosSemis[semifinalIndex].id,
    };
    partidosCuartos.push(partido);

    await partidoService.crear(temporadaId, competicionId, partido);

    // Avance automático por bye
    if (local.id === 'bye') {
      equiposQuePasanASemis.push(visitante);
    } else if (visitante.id === 'bye') {
      equiposQuePasanASemis.push(local);
    }
  }
  await jornadaService.crear(temporadaId, competicionId, rondaCuartos);
  partidosPorRonda[rondaCuartos.id] = partidosCuartos;

  // 4️⃣ Insertar equipos que avanzan automáticamente en semis
  for (const equipo of equiposQuePasanASemis) {
    const partidoSemi = partidosSemis.find(
      (p) =>
        p.equipoLocal.id === 'por-definir' ||
        p.equipoVisitante.id === 'por-definir'
    );
    if (partidoSemi) {
      if (partidoSemi.equipoLocal.id === 'por-definir') {
        partidoSemi.equipoLocal = equipo;
      } else if (partidoSemi.equipoVisitante.id === 'por-definir') {
        partidoSemi.equipoVisitante = equipo;
      }
      // Actualizar la semi en Firestore
      await partidoService.actualizarPartido(
        temporadaId,
        competicionId,
        partidoSemi.id,
        partidoSemi
      );
    }
  }

  return {
    rondas,
    partidosPorRonda,
  };
}
