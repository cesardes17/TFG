// src/services/partidoService.ts
import { EstadoPartido, Partido, PartidoRT } from '../types/Partido';
import { ResultService } from '../types/ResultService';
import { FirestoreService, WhereClause } from './core/firestoreService';
import { RealtimeService } from './core/realtimeService';

const COLLECTION = 'partidos';
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
        COLLECTION,
      ];
      const partidoRes = await FirestoreService.setDocumentByPath(
        ...path,
        partido.id,
        partido
      );
      if (!partidoRes.success) {
        throw new Error(partidoRes.errorMessage);
      }
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
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
        COLLECTION,
      ];
      const filter: WhereClause[] = [['jornadaId', '==', jornadaId]];
      const partidosRes = await FirestoreService.getCollectionByPath<Partido>(
        path,
        filter
      );
      if (!partidosRes.success) {
        throw new Error(partidosRes.errorMessage);
      }
      return { success: true, data: partidosRes.data! };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  /**
   * Obtiene todos los partidos asociados a una serie (serieId).
   */
  getAllBySerie: async (
    temporadaId: string,
    competicionId: string,
    serieId: string
  ): Promise<ResultService<Partido[]>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        COLLECTION,
      ];
      const filter: WhereClause[] = [['serieId', '==', serieId]];
      const partidosRes = await FirestoreService.getCollectionByPath<Partido>(
        path,
        filter
      );
      if (!partidosRes.success) {
        throw new Error(partidosRes.errorMessage);
      }
      return { success: true, data: partidosRes.data! };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
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
        COLLECTION,
        partidoId,
      ];
      const partidoRes = await FirestoreService.getDocumentByPath<Partido>(
        ...path
      );
      if (!partidoRes.success || !partidoRes.data) {
        throw new Error(partidoRes.errorMessage);
      }
      return { success: true, data: partidoRes.data };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
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
        COLLECTION,
        partidoId,
      ];
      const res = await FirestoreService.updateDocumentByPath(path, {
        fecha,
        cancha,
      });
      if (!res.success) throw new Error(res.errorMessage);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  iniciarPartido: async (
    temporadaId: string,
    competicionId: string,
    partidoId: string
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        COLLECTION,
        partidoId,
      ];
      const res = await FirestoreService.updateDocumentByPath(path, {
        estado: 'en-juego' as EstadoPartido,
      });
      if (!res.success) throw new Error(res.errorMessage);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  actualizarPartido: async (
    temporadaId: string,
    competicionId: string,
    partidoId: string,
    partido: Partial<Partido>
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        COLLECTION,
        partidoId,
      ];
      const res = await FirestoreService.updateDocumentByPath(path, partido);
      if (!res.success) throw new Error(res.errorMessage);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
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
        COLLECTION,
        partido.id,
      ];
      const res = await FirestoreService.updateDocumentByPath(path, {
        ...partido,
        estado: 'finalizado' as EstadoPartido,
      });
      if (!res.success) throw new Error(res.errorMessage);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  eliminarPartido: async (
    temporadaId: string,
    competicionId: string,
    partidoId: string
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        COLLECTION,
        partidoId,
      ];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      if (!res.success) throw new Error(res.errorMessage);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  // ---------------------------------------------
  // Métodos Realtime Database
  // ---------------------------------------------

  crearRealtime: async (partido: PartidoRT): Promise<ResultService<null>> => {
    try {
      const base = [COLLECTION, partido.id];
      return await RealtimeService.setValue(base, partido);
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  updateRealtime: async (partido: PartidoRT): Promise<ResultService<null>> => {
    try {
      const base = [COLLECTION, partido.id];
      return await RealtimeService.updateValue(base, partido);
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  updatePartialRealtime: async (
    partidoId: string,
    partido: Partial<PartidoRT>
  ): Promise<ResultService<null>> => {
    try {
      const base = [COLLECTION, partidoId];
      return await RealtimeService.updateValue(base, partido);
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  deleteRealtime: async (partidoId: string): Promise<ResultService<null>> => {
    try {
      return await RealtimeService.removeValue([COLLECTION, partidoId]);
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  getPartidoRealtimeOnce: async (
    partidoId: string
  ): Promise<ResultService<PartidoRT | null>> => {
    try {
      const base = [COLLECTION, partidoId];
      return await RealtimeService.getValue<PartidoRT>(base);
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  onPartidoRealtime: async (
    partidoId: string,
    callback: (data: PartidoRT | null) => void
  ): Promise<() => void> => {
    const base = [COLLECTION, partidoId];
    return await RealtimeService.onValue<PartidoRT>(base, callback);
  },

  onAllPartidosRealtime: async (
    callback: (lista: Record<string, PartidoRT> | null) => void
  ): Promise<() => void> => {
    const base = [COLLECTION];
    return await RealtimeService.onValue<Record<string, PartidoRT>>(
      base,
      callback
    );
  },
};
