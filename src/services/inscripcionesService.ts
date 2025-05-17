import { Inscripcion } from '../types/Inscripcion';
import { ResultService } from '../types/ResultService';
import { FirestoreService, WhereClause } from './core/firestoreService';

const COLLECTION = 'inscripciones';
export const inscripcionesService = {
  crearInscripcion: async (
    temporadaId: string,
    id: string,
    inscripcion: Inscripcion
  ): Promise<ResultService<Inscripcion>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, id];
      const res = await FirestoreService.setDocumentByPath(
        ...path,
        inscripcion
      );
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al crear la inscripcion');
      }
      return {
        success: true,
        data: inscripcion,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al crear la inscripcion',
      };
    }
  },

  getInscripcionesByTeam: async (
    temporadaId: string,
    equipoId: string
  ): Promise<ResultService<Inscripcion[]>> => {
    try {
      const pathSegments = ['temporadas', temporadaId, COLLECTION];
      const andFilters: [
        string,
        import('firebase/firestore').WhereFilterOp,
        any
      ][] = [['equipoId', '==', equipoId]];
      const orFilters: [
        string,
        import('firebase/firestore').WhereFilterOp,
        any
      ][] = [];

      // Ahora use getCollectionByPath en lugar de getDocumentsWithFilterByPath
      const res = await FirestoreService.getCollectionByPath<Inscripcion>(
        pathSegments,
        andFilters,
        orFilters
      );

      if (!res.success) {
        throw new Error(
          res.errorMessage || 'Error al obtener los jugadores del equipo'
        );
      }

      return {
        success: true,
        data: res.data!,
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener los jugadores del equipo',
      };
    }
  },

  getDorsalesByTeam: async (
    temporadaId: string,
    equipoId: string
  ): Promise<ResultService<number[]>> => {
    try {
      const pathSegments = ['temporadas', temporadaId, COLLECTION];
      const andFilters: WhereClause[] = [['equipoId', '==', equipoId]];

      const res = await FirestoreService.getCollectionByPath<Inscripcion>(
        pathSegments,
        andFilters
      );

      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener los dorsales');
      }

      const inscripciones = res.data!;
      const dorsales = inscripciones.map((i) => i.jugador.dorsal);

      return { success: true, data: dorsales };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener los dorsales',
      };
    }
  },

  getInscripcion: async (
    temporadaId: string,
    jugadorId: string
  ): Promise<ResultService<Inscripcion>> => {
    try {
      const pathSegments = ['temporadas', temporadaId, COLLECTION];
      const andFilters: WhereClause[] = [['jugador.id', '==', jugadorId]];

      const res = await FirestoreService.getCollectionByPath<Inscripcion>(
        pathSegments,
        andFilters
      );

      if (!res.success || !res.data || res.data.length === 0) {
        throw new Error(res.errorMessage || 'Inscripción no encontrada');
      }

      return {
        success: true,
        data: res.data[0],
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener la inscripción',
      };
    }
  },

  deleteInscripcion: async (
    temporadaId: string,
    jugadorId: string
  ): Promise<ResultService<null>> => {
    try {
      const solicitud = await inscripcionesService.getInscripcion(
        temporadaId,
        jugadorId
      );
      if (!solicitud.success || !solicitud.data) {
        throw new Error(
          solicitud.errorMessage || 'Error al eliminar la inscripcion'
        );
      }
      const path = ['temporadas', temporadaId, COLLECTION, solicitud.data.id];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al eliminar la inscripcion');
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
            : 'Error al eliminar la inscripcion',
      };
    }
  },

  deleteInscripcionById: async (
    temporadaId: string,
    docId: string
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, docId];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al eliminar la inscripcion');
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
            : 'Error al eliminar la inscripcion',
      };
    }
  },
};
