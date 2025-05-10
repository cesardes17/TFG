import { Equipo } from '../types/Equipo';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

export const equipoService = {
  crearEquipo: async (
    temporadaId: string,
    id: string,
    data: Equipo
  ): Promise<ResultService<string>> => {
    try {
      const path = ['temporadas', temporadaId, 'equipos', id];
      await FirestoreService.setDocumentByPath(...path, data);
      return {
        success: true,
        data: id,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al crear el equipo',
      };
    }
  },
};
