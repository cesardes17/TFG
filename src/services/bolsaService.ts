import { BolsaJugador } from '../types/BolsaJugador';
import { ResultService } from '../types/ResultService';
import { getRandomUID } from '../utils/getRandomUID';
import { FirestoreService } from './core/firestoreService';
import { temporadaService } from './temporadaService';

const COLLECTION = 'bolsaJugadores';

export const bolsaJugadoresService = {
  getJugadoresInscritos: async (
    temporadaID: string
  ): Promise<ResultService<BolsaJugador[]>> => {
    try {
      const path = ['temporadas', temporadaID, COLLECTION];
      const res = await FirestoreService.getCollectionByPath(...path);
      if (!res.success || !res.data) {
        throw new Error(
          res.errorMessage || 'Error al obtener los jugadores inscritos'
        );
      }
      return {
        success: true,
        data: res.data as BolsaJugador[],
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener jugadores inscritos de la Bolsa',
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
      const path = ['temporadas', temporadaId, COLLECTION];
      const res =
        await FirestoreService.getDocumentsWithFilterByPath<BolsaJugador>(
          [['jugador.id', '==', userId]],
          [], //filtros or vacios
          ...path
        );

      if (!res.success || !res.data) {
        throw new Error(res.errorMessage || 'Error al inscribir jugador');
      }

      return { success: true, data: res.data[0] };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al inscribir jugador',
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
