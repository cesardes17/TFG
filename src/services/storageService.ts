// src/services/storageService.ts
import { uploadFileFS, deleteFileFS } from '../api/storageFirebase';
import type { ResultService } from '../types/ResultService';

/**
 * Servicio de alto nivel para operaciones con Firebase Storage
 * que proporciona resultados unificados
 */
export const StorageService = {
  /**
   * Sube un archivo a Firebase Storage
   * @param path - Ruta donde subir el archivo (ej: 'profiles/uid.jpg')
   * @param file - En web un Blob o File, en nativo una ruta de archivo local
   * @returns URL de descarga del archivo
   */
  uploadFile: async (
    path: string,
    file: Blob | File | string
  ): Promise<ResultService<string>> => {
    try {
      const downloadURL = await uploadFileFS(path, file);
      return {
        success: true,
        data: downloadURL,
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error al subir el archivo',
      };
    }
  },

  /**
   * Elimina un archivo de Firebase Storage
   * @param path - Ruta del archivo a eliminar
   */
  deleteFile: async (path: string): Promise<ResultService<null>> => {
    try {
      await deleteFileFS(path);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error al eliminar el archivo',
      };
    }
  },
};
