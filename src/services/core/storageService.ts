// src/services/storageService.ts
import { Platform } from 'react-native';
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
  ): Promise<ResultService<{ url: string; fileName: string }>> => {
    try {
      const preparedFile = await prepareUploadData(file);

      // Extrae extensión (solo si es string o File con nombre)
      const uri = typeof file === 'string' ? file : (file as File).name ?? '';
      const extMatch = /\.(jpg|jpeg|png|gif)$/i.exec(uri);
      const extension = extMatch ? extMatch[1] : 'jpg';

      const fileName = `${getRandomUID()}.${extension}`;
      const remotePath = `${folder.replace(/\/+$/, '')}/${fileName}`;

      const downloadUrl = await uploadFileFS(remotePath, preparedFile);

      return { success: true, data: { url: downloadUrl, fileName: fileName } };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error al subir el archivo',
      };
    }
  },

  /**
   * Elimina un archivo de Firebase Storage construyendo la ruta con bucket y nombre
   * @param bucket - carpeta raíz o prefix del archivo (ej. 'fotos_jugadores')
   * @param name - nombre o ruta interna del archivo (ej. 'abc123.jpg')
   */
  deleteFile: async (
    bucket: string,
    name: string
  ): Promise<ResultService<null>> => {
    try {
      if (!bucket || !name) {
        throw new Error('Bucket o nombre de archivo inválido');
      }

      const filePath = `${bucket}/${name}`; // 👈 Concatenamos bucket + nombre
      await deleteFileFS(filePath); // ✅ Llamada directa

      return { success: true, data: null };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error al eliminar el archivo',
      };
    }
  },
};

async function prepareUploadData(
  file: Blob | File | string
): Promise<Blob | File | string> {
  if (Platform.OS === 'web' && typeof file === 'string') {
    const response = await fetch(file);
    const blob = await response.blob();
    return blob;
  }
  return file;
}
