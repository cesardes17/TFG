import { BolsaJugador } from '../types/BolsaJugador';
import { ResultService } from '../types/ResultService';
import { getRandomUID } from '../utils/getRandomUID';
import { FirestoreService, WhereClause } from './core/firestoreService';
import { temporadaService } from './temporadaService';

const COLLECTION = 'bolsaJugadores';

export const bolsaJugadoresService = {
  getJugadoresInscritos: async (
    temporadaId: string
  ): Promise<ResultService<BolsaJugador[]>> => {
    try {
      const pathSegments = ['temporadas', temporadaId, COLLECTION];

      // Ahora le pasamos el array completo como primer parámetro
      const res = await FirestoreService.getCollectionByPath<BolsaJugador>(
        pathSegments
      );

      if (!res.success || !res.data) {
        throw new Error(
          res.errorMessage || 'Error al obtener los jugadores inscritos'
        );
      }

      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener jugadores inscritos de la bolsa',
      };
    }
  },

  inscribirJugador: async (
    idTemporada: string,
    payload: BolsaJugador
  ): Promise<ResultService<BolsaJugador>> => {
    try {
      const path = ['temporadas', idTemporada, COLLECTION, payload.id];

      const res = await FirestoreService.setDocumentByPath(...path, payload);

      if (!res.success || !res.data) {
        throw new Error(res.errorMessage || 'Error al inscribir jugador');
      }
      return { success: true, data: payload };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al inscribir jugador',
      };
    }
  },

  getJugadorInscrito: async (
    temporadaId: string,
    userId: string
  ): Promise<ResultService<BolsaJugador>> => {
    try {
      const pathSegments = ['temporadas', temporadaId, COLLECTION];
      const andFilters: WhereClause[] = [['jugador.id', '==', userId]];

      // Usamos getCollectionByPath para filtrar dentro de la subcolección
      const res = await FirestoreService.getCollectionByPath<BolsaJugador>(
        pathSegments,
        andFilters
      );

      if (!res.success || !res.data || res.data.length === 0) {
        throw new Error(res.errorMessage || 'Jugador no inscrito en la bolsa');
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
            : 'Error al obtener la inscripción del jugador',
      };
    }
  },

  deleteJugadorInscrito: async (
    temporadaId: string,
    jugadorId: string
  ): Promise<ResultService<Boolean>> => {
    console.log('jugadorID: ', jugadorId);
    try {
      const resGetDoc = await bolsaJugadoresService.getJugadorInscrito(
        temporadaId,
        jugadorId
      );
      if (!resGetDoc.success || !resGetDoc.data) {
        throw new Error(
          resGetDoc.errorMessage || 'Error al obtener el jugador inscrito'
        );
      }

      const path = [
        'temporadas',
        temporadaId,
        'bolsaJugadores',
        resGetDoc.data.id,
      ];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      console.log('Bolsa Service - res: ', res);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al inscribir jugador');
      }

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al inscribir jugador',
      };
    }
  },
};
