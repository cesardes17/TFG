// src/utils/competiciones/generarCuadroCopa.ts
import { jornadaService } from '../../services/jornadaService';
import { partidoService } from '../../services/partidoService';
import { EstadoJornada, Jornada } from '../../types/Jornada';
import { Partido } from '../../types/Partido';
import { getRandomUID } from '../getRandomUID';

export async function generarCuadroCopa(
  temporadaId: string,
  copaId: string,
  equipos: { id: string; nombre: string; escudoUrl: string }[],
  onProgress?: (text: string) => void
): Promise<{
  rondas: Jornada[];
  partidosPorRonda: Record<string, Partido[]>;
}> {
  const rondas: Jornada[] = [];
  const partidosPorRonda: Record<string, Partido[]> = {};

  // Crear 3 rondas: Cuartos, Semifinales, Final
  const nombresRondas = ['Cuartos de Final', 'Semifinales', 'Final'];
  const numPartidosPorRonda = [4, 2, 1];

  let equiposRonda = [...equipos];

  for (let i = 0; i < nombresRondas.length; i++) {
    const rondaId = getRandomUID();
    const nombre = nombresRondas[i];

    onProgress?.(`Generando ronda: ${nombre}`);

    const ronda: Jornada = {
      id: rondaId,
      nombre,
      numero: i + 1,
      estado: 'pendiente' as EstadoJornada,
    };

    rondas.push(ronda);
    partidosPorRonda[rondaId] = [];

    // Generar partidos
    for (let j = 0; j < numPartidosPorRonda[i]; j++) {
      const equipoLocal = equiposRonda[j * 2] || {
        id: '',
        nombre: '',
        escudoUrl: '',
      };
      const equipoVisitante = equiposRonda[j * 2 + 1] || {
        id: '',
        nombre: '',
        escudoUrl: '',
      };

      const partido: Partido = {
        id: getRandomUID(),
        jornadaId: rondaId,
        tipoCompeticion: 'copa',
        equipoLocal,
        equipoVisitante,
        estado: 'pendiente',
      };

      partidosPorRonda[rondaId].push(partido);

      // Guardar partido en Firestore
      await partidoService.crear(temporadaId, copaId, partido);
    }

    // Guardar ronda en Firestore
    await jornadaService.crear(temporadaId, copaId, ronda);

    // Preparar equipos para la siguiente ronda (vacíos hasta que se definan en la fase real)
    equiposRonda = new Array(numPartidosPorRonda[i]).fill({
      id: '',
      nombre: '',
      escudoUrl: '',
    });
  }

  return { rondas, partidosPorRonda };
}
