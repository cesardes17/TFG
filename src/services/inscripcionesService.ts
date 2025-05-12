import { Inscripcion } from '../types/Inscripcion';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

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
    id: string
  ): Promise<ResultService<Inscripcion[]>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION];
      const res = await FirestoreService.getDocumentsWithFilterByPath(
        [['equipoId', '==', id]],
        [],
        ...path
      );
      return {
        success: true,
        data: res.data as Inscripcion[],
      };
    } catch (error) {
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
      const path = ['temporadas', temporadaId, COLLECTION];
      const res = await FirestoreService.getDocumentsWithFilterByPath(
        [['equipoId', '==', equipoId]],
        [],
        ...path
      );
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener los dorsales');
      }
      const inscripciones = res.data as Inscripcion[];
      const dorsales = inscripciones.map(
        (inscripcion) => inscripcion.jugador.dorsal
      );
      return {
        success: true,
        data: dorsales,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener los dorsales',
      };
    }
  },
};
