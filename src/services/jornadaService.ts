import { Jornada } from '../types/Jornada';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

export const jornadaService = {
  crear: async (
    temporadaId: string,
    competicionId: string,
    jornada: Jornada
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'jornadas',
      ];
      const jornadaRes = await FirestoreService.setDocumentByPath(
        ...path,
        jornada.id,
        jornada
      );
      if (!jornadaRes.success) {
        throw new Error(jornadaRes.errorMessage || 'Error al crear jornada');
      }
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear jornada',
        data: null,
      } as ResultService<null>;
    }
  },

  getAll: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<Jornada[]>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'jornadas',
      ];
      const jornadasRes = await FirestoreService.getCollectionByPath<Jornada>(
        path
      );
      if (!jornadasRes.success) {
        throw new Error(
          jornadasRes.errorMessage || 'Error al obtener jornadas'
        );
      }
      return {
        success: true,
        data: jornadasRes.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: 'Error al obtener jornadas',
      };
    }
  },
};
