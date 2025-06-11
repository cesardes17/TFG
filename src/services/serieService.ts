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

  async finalizarSerieYAvanzar(
    temporadaId: string,
    competicionId: string,
    serie: Serie,
    equipoGanador: { nombre: string; id: string; escudoUrl: string }
  ): Promise<ResultService<null>> {
    try {
      // 1️⃣ Actualizar la serie como finalizada y asignar ganador
      const updateData: Partial<Serie> = {
        estado: 'finalizada',
        ganadorId: equipoGanador.id,
      };
      const resUpd = await this.actualizar(
        temporadaId,
        competicionId,
        serie.id,
        updateData
      );
      if (!resUpd.success) {
        throw new Error(resUpd.errorMessage || 'Error actualizando la serie');
      }

      // 2️⃣ Avanzar a la siguiente serie si corresponde
      if (serie.nextSerieId) {
        const resSiguiente = await this.getSerie(
          temporadaId,
          competicionId,
          serie.nextSerieId
        );
        if (!resSiguiente.success || !resSiguiente.data) {
          throw new Error(
            resSiguiente.errorMessage ||
              'Error obteniendo la siguiente serie para avanzar'
          );
        }
        const siguienteSerie = resSiguiente.data;

        const updateSiguiente: Partial<Serie> = {};
        if (!siguienteSerie.local) {
          updateSiguiente.local = equipoGanador;
        } else if (!siguienteSerie.visitante) {
          updateSiguiente.visitante = equipoGanador;
        }

        const resUpdSiguiente = await this.actualizar(
          temporadaId,
          competicionId,
          siguienteSerie.id,
          updateSiguiente
        );
        if (!resUpdSiguiente.success) {
          throw new Error(
            resUpdSiguiente.errorMessage ||
              'Error actualizando la siguiente serie'
          );
        }

        // ⚡ También podrías actualizar los partidos de la siguiente serie
      }

      return { success: true, data: null };
    } catch (e: any) {
      console.error('finalizarSerieYAvanzar error:', e);
      return { success: false, errorMessage: e.message };
    }
  },
};
