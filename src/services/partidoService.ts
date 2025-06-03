import { Partido } from '../types/Partido';
import { ResultService } from '../types/ResultService';
import { FirestoreService, WhereClause } from './core/firestoreService';

export const partidoService = {
  crear: async (
    temporadaId: string,
    competicionId: string,
    partido: Partido
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'partidos',
      ];
      const partidoRes = await FirestoreService.setDocumentByPath(
        ...path,
        partido.id,
        partido
      );
      if (!partidoRes.success) {
        throw new Error(partidoRes.errorMessage);
      }
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al crear partido',
      };
    }
  },
  getAllByJornada: async (
    temporadaId: string,
    competicionId: string,
    jornadaId: string
  ): Promise<ResultService<Partido[]>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'partidos',
      ];

      const filter: WhereClause[] = [['jornadaId', '==', jornadaId]];

      const partidosRes = await FirestoreService.getCollectionByPath<Partido>(
        path,
        filter
      );
      if (!partidosRes.success) {
        throw new Error(partidosRes.errorMessage);
      }
      return {
        success: true,
        data: partidosRes.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al obtener partidos',
      };
    }
  },

  getPartido: async (
    temporadaId: string,
    competicionId: string,
    partidoId: string
  ): Promise<ResultService<Partido>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'partidos',
        partidoId,
      ];
      const partidoRes = await FirestoreService.getDocumentByPath<Partido>(
        ...path
      );
      if (!partidoRes.success || !partidoRes.data) {
        throw new Error(partidoRes.errorMessage);
      }
      return {
        success: true,
        data: partidoRes.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al obtener partido',
      };
    }
  },

  actualizarFechaCancha: async (
    temporadaId: string,
    competicionId: string,
    partidoId: string,
    fecha: Date,
    cancha: string
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'partidos',
        partidoId,
      ];
      const partidoRes = await FirestoreService.updateDocumentByPath(path, {
        fecha,
        cancha,
      });
      if (!partidoRes.success) {
        throw new Error(partidoRes.errorMessage);
      }
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar partido',
      };
    }
  },

  finalizarPartido: async (
    temporadaId: string,
    competicionId: string,
    partido: Partido
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'partidos',
        partido.id,
      ];
      const partidoRes = await FirestoreService.updateDocumentByPath(
        path,
        partido
      );
      if (!partidoRes.success) {
        throw new Error(partidoRes.errorMessage);
      }
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar partido',
      };
    }
  },
};
