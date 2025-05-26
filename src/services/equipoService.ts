import { Equipo } from '../types/Equipo';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

const COLLECION = 'equipos';

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

  /**Obtiene el equipo */
  getEquipo: async (
    temporadaId: string,
    id: string
  ): Promise<ResultService<Equipo>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECION, id];
      const res = await FirestoreService.getDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener el equipo');
      }

      return {
        success: true,
        data: res.data as Equipo,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al crear el equipo',
      };
    }
  },

  getEquipos: async (temporadaId: string): Promise<ResultService<Equipo[]>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECION];
      const res = await FirestoreService.getCollectionByPath(path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener los equipos');
      }
      return {
        success: true,
        data: res.data as Equipo[],
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener los equipos',
      };
    }
  },

  deleteEquipo: async (
    temporadaId: string,
    id: string
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECION, id];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al eliminar el equipo');
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
            : 'Error al eliminar el equipo',
      };
    }
  },
};
