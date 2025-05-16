import { FirestoreService } from '../core/firestoreService';
import { Anuncio } from '../../types/Anuncio';
import { ResultService } from '../../types/ResultService';
import { StorageService } from '../core/storageService';

const COLLECTION = 'anuncios';

export const anunciosCrudService = {
  /** Crear anuncio en una temporada */
  crearAnuncio: async (
    temporadaId: string,
    id: string,
    data: Anuncio
  ): Promise<ResultService<string>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, id];
      if (data.imagenUrl) {
        const res = await StorageService.uploadFile('anuncios', data.imagenUrl);
        if (!res.success) {
          throw new Error(res.errorMessage || 'Error al subir la imagen');
        }
        data.imagenUrl = res.data as string;
      }
      const res = await FirestoreService.setDocumentByPath(...path, data);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al crear el anuncio');
      }
      return {
        success: true,
        data: id,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al crear el anuncio',
      };
    }
  },

  /** Obtener anuncio individual */
  getAnuncio: async (
    temporadaId: string,
    id: string
  ): Promise<ResultService<Anuncio>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, id];
      const res = await FirestoreService.getDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener el anuncio');
      }
      return {
        success: true,
        data: res.data as Anuncio,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener el anuncio',
      };
    }
  },

  /** Eliminar anuncio individual */
  deleteAnuncio: async (
    temporadaId: string,
    id: string
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, id];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al eliminar el anuncio');
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
            : 'Error al eliminar el anuncio',
      };
    }
  },
  getAllAnuncios: async (
    temporadaId: string
  ): Promise<ResultService<Anuncio[]>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION];
      const res = await FirestoreService.getCollectionByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener los anuncios');
      }
      return {
        success: true,
        data: res.data as Anuncio[],
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener los anuncios',
      };
    }
  },
};
