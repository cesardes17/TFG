// src/services/competitionService/baseService.ts
import { FirestoreService } from '../core/firestoreService';
import { Competicion } from '../../types/Competicion';
import { ResultService } from '../../types/ResultService';

const COLLECTION = 'competiciones';

export const competitionBaseService = {
  crearCompeticion: async (
    temporadaId: string,
    competicionId: string,
    data: Competicion
  ): Promise<ResultService<string>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.setDocumentByPath(...path, data);
      return res;
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al crear la competición',
      };
    }
  },

  getCompeticion: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<Competicion>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.getDocumentByPath<Competicion>(
        ...path
      );
      if (!res.success || !res.data) {
        throw new Error(
          res.errorMessage || 'No se pudo obtener la competición'
        );
      }
      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener la competición',
      };
    }
  },

  actualizarCompeticion: async (
    temporadaId: string,
    competicionId: string,
    data: Partial<Competicion>
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.updateDocumentByPath(path, data);
      return res;
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar la competición',
      };
    }
  },

  eliminarCompeticion: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      return res;
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al eliminar la competición',
      };
    }
  },
};
