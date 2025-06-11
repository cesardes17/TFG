// src/services/serieService.ts
import { Serie } from '../types/Serie';
import { ResultService } from '../types/ResultService';
import {
  FirestoreService,
  OrderClause,
  WhereClause,
} from './core/firestoreService';
import { partidoService } from './partidoService';
import { Partido } from '../types/Partido';
import { getRandomUID } from '../utils/getRandomUID';
import { TipoCompeticion } from '../types/Competicion';

const BASE_PATH = (temporadaId: string, competicionId: string): string[] => [
  'temporadas',
  temporadaId,
  'competiciones',
  competicionId,
  'series',
];

/**
 * Servicio para operaciones CRUD sobre Series de Playoffs.
 */
export const serieService = {
  /**
   * Crea una nueva serie en Firestore.
   */
  crear: async (
    temporadaId: string,
    competicionId: string,
    serie: Serie
  ): Promise<ResultService<null>> => {
    try {
      const path = BASE_PATH(temporadaId, competicionId);
      const res = await FirestoreService.setDocumentByPath<Serie>(
        ...path,
        serie.id,
        serie
      );
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al crear serie');
      }
      return { success: true, data: null };
    } catch (error: any) {
      console.error('serieService.crear error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al crear serie',
      };
    }
  },

  /**
   * Obtiene todas las series de una competición.
   */
  getAll: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<Serie[]>> => {
    try {
      const path = BASE_PATH(temporadaId, competicionId);
      const res = await FirestoreService.getCollectionByPath<Serie>(path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener series');
      }
      return { success: true, data: res.data! };
    } catch (error: any) {
      console.error('serieService.getAll error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al obtener series',
      };
    }
  },

  /**
   * Obtiene todas las series de una jornada específica.
   */
  getAllByJornada: async (
    temporadaId: string,
    competicionId: string,
    jornadaId: string
  ): Promise<ResultService<Serie[]>> => {
    try {
      const path = BASE_PATH(temporadaId, competicionId);
      // Filtrar por jornadaId
      const andFilters: WhereClause[] = [['jornadaId', '==', jornadaId]];
      const res = await FirestoreService.getCollectionByPath<Serie>(
        path,
        andFilters
      );
      console.log('res.data', res.data);
      if (!res.success || !res.data) {
        throw new Error(
          res.errorMessage || 'Error al obtener series por jornada'
        );
      }
      return { success: true, data: res.data! };
    } catch (error: any) {
      console.error('serieService.getAllByJornada error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al obtener series por jornada',
      };
    }
  },

  /**
   * Actualiza campos de una serie existente.
   */
  actualizar: async (
    temporadaId: string,
    competicionId: string,
    serieId: string,
    data: Partial<Serie>
  ): Promise<ResultService<null>> => {
    try {
      const path = [...BASE_PATH(temporadaId, competicionId), serieId];
      const res = await FirestoreService.updateDocumentByPath(path, data);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al actualizar serie');
      }
      return { success: true, data: null };
    } catch (error: any) {
      console.error('serieService.actualizar error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al actualizar serie',
      };
    }
  },

  /**
   * Elimina una serie por su ID.
   */
  eliminar: async (
    temporadaId: string,
    competicionId: string,
    serieId: string
  ): Promise<ResultService<null>> => {
    try {
      const path = [...BASE_PATH(temporadaId, competicionId), serieId];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al eliminar serie');
      }
      return { success: true, data: null };
    } catch (error: any) {
      console.error('serieService.eliminar error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al eliminar serie',
      };
    }
  },

  /**
   * Obtiene la última serie (en orden de creación) dentro de una jornada.
   */
  getLastSerie: async (
    temporadaId: string,
    competicionId: string,
    jornadaId: string
  ): Promise<ResultService<Serie>> => {
    try {
      const path = BASE_PATH(temporadaId, competicionId);
      const andFilters: WhereClause[] = [['jornadaId', '==', jornadaId]];
      const orderBy: OrderClause[] = [['createdAt', 'desc']];
      const res = await FirestoreService.getCollectionByPath<Serie>(
        path,
        andFilters,
        [],
        orderBy,
        1
      );
      if (!res.success || !res.data || res.data.length === 0) {
        throw new Error('No se encontró la última serie');
      }
      return { success: true, data: res.data[0] };
    } catch (error: any) {
      console.error('serieService.getLastSerie error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al obtener la última serie',
      };
    }
  },

  /**
   * Obtiene una serie por su ID.
   */
  getSerie: async (
    temporadaId: string,
    competicionId: string,
    serieId: string
  ): Promise<ResultService<Serie>> => {
    try {
      const path = [...BASE_PATH(temporadaId, competicionId), serieId];
      const res = await FirestoreService.getDocumentByPath<Serie>(...path);
      if (!res.success || !res.data) {
        throw new Error('Serie no encontrada');
      }
      return { success: true, data: res.data };
    } catch (error: any) {
      console.error('serieService.getSerie error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al obtener la serie',
      };
    }
  },

  /**
   * Finaliza la serie dada, cuenta victorias, borra pendientes,
   * avanza al ganador y, si la siguiente serie ya tiene ambos equipos definidos,
   * crea sus 2 partidos iniciales.
   */
  finalizarYAvanzarSerie: async (
    temporadaId: string,
    competicionId: TipoCompeticion,
    serie: Serie,
    partidos: Partido[]
  ): Promise<ResultService<null>> => {
    try {
      // 1️⃣ Contar victorias
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
      const isFinalizada = winsLocal === 2 || winsVisit === 2;

      // 2️⃣ Actualizar esta serie
      const updateData: Partial<Serie> = {
        partidosGanadosLocal: winsLocal,
        partidosGanadosVisitante: winsVisit,
        partidosJugados,
        estado: isFinalizada ? 'finalizada' : 'en_curso',
      };
      if (isFinalizada) {
        updateData.ganadorId =
          winsLocal === 2 ? serie.local.id : serie.visitante.id;
      }

      await serieService.actualizar(
        temporadaId,
        competicionId,
        serie.id,
        updateData
      );

      // 3️⃣ Si finalizada → borrar pendientes
      if (isFinalizada) {
        await Promise.all(
          partidos
            .filter((p) => p.estado !== 'finalizado')
            .map((p) =>
              partidoService.eliminarPartido(temporadaId, competicionId, p.id)
            )
        );

        // 4️⃣ Avanzar ganador a la serie siguiente
        if (serie.nextSerieId) {
          const resNext = await serieService.getSerie(
            temporadaId,
            competicionId,
            serie.nextSerieId
          );
          if (resNext.success && resNext.data) {
            let next = resNext.data;
            const ganador =
              updateData.ganadorId === serie.local.id
                ? serie.local
                : serie.visitante;

            // Ocupamos el hueco libre (por-definir)
            const patchNext: Partial<Serie> = {};
            if (next.local.id === 'por-definir') patchNext.local = ganador;
            else if (next.visitante.id === 'por-definir')
              patchNext.visitante = ganador;

            // Aplicar patch
            await serieService.actualizar(
              temporadaId,
              competicionId,
              next.id,
              patchNext
            );

            // Actualizamos el objeto 'next' en memoria con el patch
            next = { ...next, ...patchNext };

            // 5️⃣ Si la serie siguiente está ahora completa, gestionar sus partidos
            const localDefined = next.local.id !== 'por-definir';
            const visitDefined = next.visitante.id !== 'por-definir';
            if (localDefined && visitDefined) {
              const resPartNext = await partidoService.getAllBySerie(
                temporadaId,
                competicionId,
                next.id
              );
              const existing =
                resPartNext.success && resPartNext.data ? resPartNext.data : [];

              console.log('existing', existing);
              if (existing.length === 0) {
                // Crear 2 partidos iniciales
                const iniciales: Partido[] = [1, 2].map(() => ({
                  id: getRandomUID(),
                  jornadaId: next.jornadaId,
                  serieId: next.id,
                  tipoCompeticion: competicionId,
                  equipoLocal: next.local,
                  equipoVisitante: next.visitante,
                  estado: 'pendiente',
                }));
                await Promise.all(
                  iniciales.map((p) =>
                    partidoService.crear(temporadaId, competicionId, p)
                  )
                );
              } else {
                // Actualizar equipos en partidos existentes
                await Promise.all(
                  existing.map((p) =>
                    partidoService.actualizarPartido(
                      temporadaId,
                      competicionId,
                      p.id,
                      {
                        equipoLocal: next.local,
                        equipoVisitante: next.visitante,
                      }
                    )
                  )
                );
              }
            }
          }
        }
      }

      // 6️⃣ Si empate 1–1 → crear tercer partido
      if (!isFinalizada && partidosJugados === 2) {
        const tercerPartido: Partido = {
          id: getRandomUID(),
          jornadaId: serie.jornadaId,
          serieId: serie.id,
          tipoCompeticion: competicionId,
          equipoLocal: serie.local,
          equipoVisitante: serie.visitante,
          estado: 'pendiente',
        };
        await partidoService.crear(temporadaId, competicionId, tercerPartido);
      }

      return { success: true, data: null };
    } catch (e: any) {
      console.error('serieService.finalizarYAvanzarSerie error:', e);
      return { success: false, errorMessage: e.message };
    }
  },
};
