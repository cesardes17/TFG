// src/services/serieService.ts
import { Serie } from '../types/Serie';
import { ResultService } from '../types/ResultService';
import {
  FirestoreService,
  OrderClause,
  WhereClause,
} from './core/firestoreService';

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
};
