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
      const {
        serieId,
        tipoCompeticion: competicionId,
        jornadaId,
      } = partidoFinalizado;
      if (!serieId) return { success: true, data: null };

      // 1️⃣ Leer todos los partidos de la serie
      const resP = await partidoService.getAllBySerie(
        temporadaId,
        competicionId,
        serieId
      );
      const partidos = resP.success && resP.data ? resP.data : [];

      // 2️⃣ Contar victorias
      let winsLocal = 0,
        winsVisit = 0;
      partidos.forEach((p) => {
        if (p.estado === 'finalizado' && p.resultado) {
          if (p.resultado.puntosLocal > p.resultado.puntosVisitante)
            winsLocal++;
          else if (p.resultado.puntosVisitante > p.resultado.puntosLocal)
            winsVisit++;
        }
      });
      const partidosJugados = winsLocal + winsVisit;

      // 3️⃣ Leer la serie original
      const resS = await serieService.getAllByJornada(
        temporadaId,
        competicionId,
        partidoFinalizado.jornadaId
      );
      const serie = resS.success
        ? resS.data!.find((s) => s.id === serieId)!
        : null;
      if (!serie) throw new Error('Serie no encontrada');

      // 4️⃣ Preparar payload
      const updateData: Partial<import('../../types/Serie').Serie> = {
        partidosGanadosLocal: winsLocal,
        partidosGanadosVisitante: winsVisit,
        partidosJugados,
      };

      let createThird = false;
      if (winsLocal === 2 || winsVisit === 2) {
        updateData.estado = 'finalizada';
        updateData.ganadorId =
          winsLocal === 2 ? serie.local.id : serie.visitante.id;
      } else if (partidosJugados === 2) {
        updateData.estado = 'en_curso';
        createThird = true;
      } else {
        updateData.estado = 'en_curso';
      }

      // 5️⃣ Actualizar la serie
      const resUpd = await serieService.actualizar(
        temporadaId,
        competicionId,
        serieId,
        updateData
      );
      if (!resUpd.success) throw new Error(resUpd.errorMessage);

      // 6️⃣ Si finalizada, eliminar pendientes y avanzar ganador
      if (updateData.estado === 'finalizada') {
        // Dentro de la rama if (updateData.estado === 'finalizada') …

        // 1) Borramos los partidos pendientes
        await Promise.all(
          partidos
            .filter((p) => p.estado !== 'finalizado')
            .map((p) =>
              partidoService.eliminarPartido(temporadaId, competicionId, p.id)
            )
        );

        // 2) Avanzar al ganador al primer hueco “por-definir”
        if (serie.nextSerieId) {
          console.log(
            '[PLAYOFF] Avanzando ganador a serie:',
            serie.nextSerieId
          );
          const resNext = await serieService.getSerie(
            temporadaId,
            competicionId,
            serie.nextSerieId
          );
          console.log('[PLAYOFF] getSerie:', resNext);
          if (resNext.success && resNext.data) {
            const next = resNext.data;
            // Determinar objeto ganador
            const ganador =
              updateData.ganadorId === serie.local.id
                ? serie.local
                : serie.visitante;
            // Ocupar el hueco libre
            if (next.local.id === 'por-definir') {
              await serieService.actualizar(
                temporadaId,
                competicionId,
                next.id,
                { local: ganador }
              );
              console.log(
                '[PLAYOFF] Ganador colocado en local de la siguiente serie'
              );
            } else if (next.visitante.id === 'por-definir') {
              await serieService.actualizar(
                temporadaId,
                competicionId,
                next.id,
                { visitante: ganador }
              );
              console.log(
                '[PLAYOFF] Ganador colocado en visitante de la siguiente serie'
              );
            } else {
              console.warn(
                '[PLAYOFF] No había hueco “por-definir” en la siguiente serie'
              );
            }
          }
        }
      }

      // 7️⃣ Si toca desempate, crear tercer partido
      if (createThird) {
        const partidoDecisivo: Partido = {
          id: getRandomUID(),
          jornadaId,
          serieId,
          tipoCompeticion: competicionId,
          equipoLocal: serie.local,
          equipoVisitante: serie.visitante,
          estado: 'pendiente',
        };
        await partidoService.crear(temporadaId, competicionId, partidoDecisivo);
      }

      return { success: true, data: null };
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
