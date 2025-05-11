import { BolsaJugador } from '../types/BolsaJugador';
import { ResultService } from '../types/ResultService';
import { getRandomUID } from '../utils/getRandomUID';
import { FirestoreService } from './core/firestoreService';
import { temporadaService } from './temporadaService';

const COLLECTION = 'bolsaJugadores';

export const bolsaJugadoresService = {
  getJugadoresInscritos: async (idTemporada: string) => {
    console.warn('No implmentado todavia');
  },

  inscribirJugador: async (
    idJugador: string,
    idTemporada: string
  ): Promise<ResultService<BolsaJugador>> => {
    try {
      const payload: BolsaJugador = {
        id: getRandomUID(),
        idJugador: idJugador,
        createdAt: new Date().toISOString(),
      };
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
    userId: string,
    temporadaId: string
  ): Promise<ResultService<string>> => {
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

      return { success: true, data: res.data[0].id };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al inscribir jugador',
      };
    }
  },
  deleteJugadorInscrito: async (
    docId: string,
    idTemporada: string
  ): Promise<ResultService<Boolean>> => {
    try {
      const path = ['temporadas', idTemporada, 'bolsaJugadores', docId];
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
