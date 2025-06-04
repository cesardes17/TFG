import { EstadoPartido, Partido } from '../types/Partido';
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
        COLLECTION,
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
        COLLECTION,
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
      const estado: EstadoPartido = 'en-juego';
      const partidoRes = await FirestoreService.updateDocumentByPath(path, {
        estado,
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
        COLLECTION,
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
  // ---------------------------------------------
  // Métodos Realtime Database
  // ---------------------------------------------

  /**
   * Crea (o reemplaza) un partido en RTDB:
   * /temporadas/{t}/competiciones/{c}/partidos/{p} = PartidoRT
   */
  crearRealtime: async (partido: Partido): Promise<ResultService<null>> => {
    try {
      const base = [...COLLECTION, partido.id];
      const payload: Partido = { ...partido };
      return await RealtimeService.setValue([...base, partido.id], payload);
    } catch (e: any) {
      return {
        success: false,
        errorMessage: e.message || 'RT: error al crear partido',
      };
    }
  },

  /**
   * Actualiza campos parciales de un partido en RTDB:
   * sólo envía las propiedades que han cambiado.
   */
  updateRealtime: async (
    partidoId: string,
    updates: Partial<Omit<Partido, 'id'>>
  ): Promise<ResultService<null>> => {
    try {
      const base = [...COLLECTION, partidoId];
      return await RealtimeService.updateValue([...base, partidoId], updates);
    } catch (e: any) {
      return {
        success: false,
        errorMessage: e.message || 'RT: error al actualizar partido',
      };
    }
  },

  /**
   * Elimina un nodo partido completo:
   * /temporadas/{t}/competiciones/{c}/partidos/{p}
   */
  deleteRealtime: async (partidoId: string): Promise<ResultService<null>> => {
    try {
      return await RealtimeService.removeValue([...COLLECTION, partidoId]);
    } catch (e: any) {
      return {
        success: false,
        errorMessage: e.message || 'RT: error al eliminar partido',
      };
    }
  },

  /**
   * Obtiene “una sola vez” un partido desde RTDB:
   * si existe, devuelve PartidoRT; si no, devuelve null.
   */
  getPartidoRealtimeOnce: async (
    partidoId: string
  ): Promise<ResultService<Partido | null>> => {
    try {
      const base = [...COLLECTION, partidoId];
      return await RealtimeService.getValue<Partido>([...base, partidoId]);
    } catch (e: any) {
      return {
        success: false,
        errorMessage: e.message || 'RT: error al leer partido',
      };
    }
  },

  /**
   * Se suscribe a cambios de UN partido en RTDB.
   * callback recibe null (si se borró) o PartidoRT.
   * La promesa resuelve la función “off” para cancelar la suscripción.
   */
  onPartidoRealtime: async (
    partidoId: string,
    callback: (data: Partido | null) => void
  ): Promise<() => void> => {
    const base = [...COLLECTION, partidoId];
    return await RealtimeService.onValue<Partido>(
      [...base, partidoId],
      callback
    );
  },

  /**
   * Se suscribe en tiempo real a TODOS los partidos de una competición (o de toda la ruta).
   * callback recibe un objeto con todos los nodos { [pId]: PartidoRT, … } o null si no hay ninguno.
   */
  onAllPartidosRealtime: async (
    callback: (lista: Record<string, Partido> | null) => void
  ): Promise<() => void> => {
    const base = [...COLLECTION];
    return await RealtimeService.onValue<Record<string, Partido>>(
      base,
      callback
    );
  },
};
