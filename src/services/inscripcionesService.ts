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
};
