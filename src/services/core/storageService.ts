// src/services/storageService.ts
import { uploadFileFS, deleteFileFS } from '../../api/storageFirebase';
import type { ResultService } from '../../types/ResultService';
import { getRandomUID } from '../../utils/getRandomUID';

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
    folder: string,
    file: Blob | File | string
  ): Promise<ResultService<string>> => {
    try {
      // 1) Extrae extensión a partir de la ruta original (fallback a jpg)
      const uri = typeof file === 'string' ? file : (file as File).name ?? '';
      const extMatch = /\.(jpg|jpeg|png|gif)$/i.exec(uri);
      const extension = extMatch ? extMatch[1] : 'jpg';

      // 2) Genera nombre único
      const fileName = `${getRandomUID()}.${extension}`;

      // 3) Construye ruta remota: "folder/fileName"
      const remotePath = `${folder.replace(/\/+$/, '')}/${fileName}`;

      // 4) Llama al helper de bajo nivel
      const downloadUrl = await uploadFileFS(remotePath, file);

      return { success: true, data: downloadUrl };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error al subir el archivo',
      };
    }
  },

  /**
   * Elimina un archivo de Firebase Storage
   * @param url - url del archivo a eliminar
   */
  deleteFileByUrl: async (url: string): Promise<ResultService<null>> => {
    try {
      // 1) Separa en dos por '/o/'
      const [, afterO] = url.split('/o/');
      if (!afterO) {
        throw new Error('URL de Storage inválida');
      }
      // 2) Quita los parámetros tras el '?'
      const [encodedPath] = afterO.split('?');
      // 3) Decodifica "%2F" a "/"
      const objectPath = decodeURIComponent(encodedPath);

      // Finalmente llama a tu función interna
      await deleteFileFS(objectPath);
      return { success: true, data: null };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error al eliminar el archivo',
      };
    }
  },
};
