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

  onPartidoFinalizado: async (
    temporadaId: string,
    partidoFinalizado: Partido
  ): Promise<ResultService<null>> => {
    try {
      const { serieId, tipoCompeticion: competicionId } = partidoFinalizado;
      if (!serieId) {
        // No es parte de una serie → nada que hacer
        return { success: true, data: null };
      }

      // 1️⃣ Leer todos los partidos de la serie
      const resPartidos = await partidoService.getAllBySerie(
        temporadaId,
        competicionId,
        serieId
      );
      const partidos =
        resPartidos.success && resPartidos.data ? resPartidos.data : [];

      // 2️⃣ Leer la propia serie
      const resSerie = await serieService.getSerie(
        temporadaId,
        competicionId,
        serieId
      );
      if (!resSerie.success || !resSerie.data) {
        throw new Error(resSerie.errorMessage || 'Serie no encontrada');
      }
      const serie = resSerie.data;

      // 3️⃣ Delegar en serieService toda la lógica de finalización y avance
      return await serieService.finalizarYAvanzarSerie(
        temporadaId,
        competicionId,
        serie,
        partidos
      );
    } catch (err: any) {
      console.error('playoffService.onPartidoFinalizado error:', err);
      return { success: false, errorMessage: err.message };
    }
  },

  /**
   * Crea el tercer partido en caso de empate 1-1 en la serie.
   */
  crearTercerPartido: async (
    temporadaId: string,
    competicionId: TipoCompeticion,
    serie: Serie
  ): Promise<ResultService<null>> => {
    try {
      const tercerPartido: Partido = {
        id: getRandomUID(),
        jornadaId: serie.jornadaId,
        serieId: serie.id,
        tipoCompeticion: competicionId,
        equipoLocal: serie.local,
        equipoVisitante: serie.visitante,
        estado: 'pendiente',
      };

      const resCrear = await partidoService.crear(
        temporadaId,
        competicionId,
        tercerPartido
      );

      if (!resCrear.success) {
        throw new Error(
          resCrear.errorMessage || 'Error creando el tercer partido'
        );
      }

      return { success: true, data: null };
    } catch (error: any) {
      console.error('playoffService.crearTercerPartido error:', error);
      return { success: false, errorMessage: error.message };
    }
  },
};
