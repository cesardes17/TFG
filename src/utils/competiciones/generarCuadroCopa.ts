// src/utils/generarCuadroCopa.ts
import { getRandomUID } from '../getRandomUID';
import { Jornada } from '../../types/Jornada';
import { Partido } from '../../types/Partido';

type EquipoSimple = { id: string; nombre: string; escudoUrl: string };

export function generarCuadroCopa(equiposOriginales: EquipoSimple[]): {
  rondas: Jornada[];
  partidosPorRonda: Record<string, Partido[]>;
} {
  const rondas: Jornada[] = [];
  const partidosPorRonda: Record<string, Partido[]> = {};

  const equipos: EquipoSimple[] = [...equiposOriginales];
  while (equipos.length < 8) {
    equipos.push({ id: 'bye', nombre: 'DESCANSA', escudoUrl: '' });
  }

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
  partidosPorRonda[rondaFinal.id] = [partidoFinal];

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
      siguientePartidoId: partidoFinal.id,
    };
    partidosSemis.push(partido);
  }
  partidosPorRonda[rondaSemis.id] = partidosSemis;

  const rondaCuartos: Jornada = {
    id: getRandomUID(),
    nombre: 'Cuartos de Final',
    numero: 1,
    estado: 'pendiente',
  };
  rondas.push(rondaCuartos);

  const partidosCuartos: Partido[] = [];
  const equiposQuePasanASemis: EquipoSimple[] = [];

  const cuartosAsemisMap: Record<number, number> = {
    0: 0,
    3: 0,
    1: 1,
    2: 1,
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

    if (local.id === 'bye') {
      equiposQuePasanASemis.push(visitante);
    } else if (visitante.id === 'bye') {
      equiposQuePasanASemis.push(local);
    }
  }
  partidosPorRonda[rondaCuartos.id] = partidosCuartos;

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
    }
  }

  return {
    rondas,
    partidosPorRonda,
  };
}
