// src/services/competicionService/playoffService.ts
import { TipoCompeticion } from '../../types/Competicion';
import { Partido } from '../../types/Partido';
import { Serie } from '../../types/Serie';
import { ResultService } from '../../types/ResultService';

import { clasificacionService } from '../clasificacionService';
import { FirestoreService } from '../core/firestoreService';
import { partidoService } from '../partidoService';
import { serieService } from '../serieService';
import { getRandomUID } from '../../utils/getRandomUID';
import { generarCuadroPlayoffs } from '../../utils/competiciones/generarCuadroPlayOffs';

const competicion: TipoCompeticion = 'playoffs';

export const playoffService = {
  /**
   * Crea la competición de Playoffs:
   * - Obtiene top 8 de la clasificación de Liga Regular.
   * - Inserta el documento de competición 'playoffs'.
   * - Genera cuadro de Playoffs (series y partidos).
   */
  crear: async (
    temporadaId: string,
    onProgress?: (text: string) => void
  ): Promise<ResultService<null>> => {
    try {
      if (onProgress) onProgress('Obteniendo Top 8 Equipos...');
      const resClasif = await clasificacionService.get(
        temporadaId,
        'liga-regular'
      );
      if (!resClasif.success || !resClasif.data) {
        throw new Error(
          resClasif.errorMessage || 'Error al obtener clasificación'
        );
      }
      const topEquipos = resClasif.data.slice(0, 8).map((c) => c.equipo);

      if (onProgress) onProgress('Guardando documento de Playoffs...');
      const playoffDoc = {
        id: competicion,
        nombre: 'Playoffs',
        tipo: competicion,
        estado: 'en-curso',
        fechaInicio: new Date(),
      };
      const resDoc = await FirestoreService.setDocumentByPath(
        'temporadas',
        temporadaId,
        'competiciones',
        playoffDoc.id,
        playoffDoc
      );
      if (!resDoc.success) {
        return { success: false, errorMessage: resDoc.errorMessage };
      }

      if (onProgress) onProgress('Generando cuadro de Playoffs...');
      await generarCuadroPlayoffs(temporadaId, competicion, topEquipos);

      return { success: true, data: null };
    } catch (error: any) {
      console.error('playoffService.crear error:', error);
      return { success: false, errorMessage: error.message };
    }
  },

  /**
   * Lógica a ejecutar tras finalizar un partido de Playoffs.
   * Actualiza la serie, crea tercer partido si hay empate, o finaliza y avanza al ganador.
   */
  onPartidoFinalizado: async (
    temporadaId: string,
    competicionId: string,
    partidoFinalizado: Partido
  ): Promise<ResultService<null>> => {
    try {
      const serieId = partidoFinalizado.serieId;
      if (!serieId) return { success: true, data: null };

      // Obtener todos los partidos de la serie
      const resPartidos = await partidoService.getAllBySerie(
        temporadaId,
        competicionId,
        serieId
      );
      if (!resPartidos.success || !resPartidos.data) {
        throw new Error(
          resPartidos.errorMessage || 'Error al obtener partidos de serie'
        );
      }
      const partidos: Partido[] = resPartidos.data;

      // Contar victorias
      let winsLocal = 0;
      let winsVisit = 0;
      partidos.forEach((p) => {
        if (p.estado !== 'finalizado' || !p.resultado) return;
        if (p.resultado.puntosLocal > p.resultado.puntosVisitante) winsLocal++;
        else if (p.resultado.puntosVisitante > p.resultado.puntosLocal)
          winsVisit++;
      });

      // Leer la serie
      const resSerie = await serieService.getAllByJornada(
        temporadaId,
        competicionId,
        partidoFinalizado.jornadaId
      );
      if (!resSerie.success || !resSerie.data) {
        throw new Error(
          resSerie.errorMessage || 'Error al obtener series de jornada'
        );
      }
      const serie = resSerie.success
        ? resSerie.data.find((s) => s.id === serieId)
        : null;
      if (!serie) {
        throw new Error('Serie no encontrada');
      }

      // Si alguien llega a 2 victorias -> finalizar serie
      if (winsLocal === 2 || winsVisit === 2) {
        const ganadorId = winsLocal === 2 ? serie.local.id : serie.visitante.id;
        await serieService.actualizar(temporadaId, competicionId, serieId, {
          estado: 'finalizada',
          ganadorId,
          partidosGanadosLocal: winsLocal,
          partidosGanadosVisitante: winsVisit,
          partidosJugados: winsLocal + winsVisit,
        });
        // Eliminar partidos no jugados
        for (const p of partidos) {
          if (p.estado !== 'finalizado') {
            await partidoService.eliminarPartido(
              temporadaId,
              competicionId,
              p.id
            );
          }
        }
        // TODO: avanzar ganador a la siguiente serie (actualizar nextSerieId)
        return { success: true, data: null };
      }

      // Si 1-1 tras dos partidos -> crear tercer partido
      const finishedCount = partidos.filter(
        (p) => p.estado === 'finalizado'
      ).length;
      if (finishedCount === 2) {
        const partidoDes = {
          id: getRandomUID(),
          jornadaId: partidoFinalizado.jornadaId,
          serieId,
          tipoCompeticion: 'playoffs',
          equipoLocal: serie.local,
          equipoVisitante: serie.visitante,
          estado: 'pendiente',
        } as Partido;
        await partidoService.crear(temporadaId, competicionId, partidoDes);
      }

      return { success: true, data: null };
    } catch (error: any) {
      console.error('playoffService.onPartidoFinalizado error:', error);
      return { success: false, errorMessage: error.message };
    }
  },
};
