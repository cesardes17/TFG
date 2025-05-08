// src/services/firestoreService.ts

import {
  deleteDocumentByPathFS,
  getCollectionByPathFS,
  getDocumentByPathFS,
  setDocumentByPathFS,
} from '../api/firestoreFirebase';
import { ResultService } from '../types/ResultService';

/**
 * Servicio unificado para Firestore con rutas dinámicas
 */
export const FirestoreService = {
  /**
   * Obtiene un documento en la ruta dada: ...'colección','docId'
   */
  getDocumentByPath: async <T>(
    ...pathSegments: string[]
  ): Promise<ResultService<T | null>> => {
    try {
      const data = await getDocumentByPathFS<T>(...pathSegments);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  /**
   * Obtiene todos los documentos de una colección anidada:
   * ...'colección','docId','subcolección', etc
   */
  getCollectionByPath: async <T>(
    ...pathSegments: string[]
  ): Promise<ResultService<T[]>> => {
    try {
      const data = await getCollectionByPathFS<T>(...pathSegments);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  /**
   * Crea o reemplaza un documento en la ruta dada.
   * El payload debe ser el último argumento.
   *
   * Ejemplos de uso:
   * // ID explícito:
   * FirestoreService.setDocumentByPath('users', uid, payload)
   *
   * // ID automático:
   * FirestoreService.setDocumentByPath('temporadas', temporadaId, 'bolsa', jugadorObj)
   */
  setDocumentByPath: async <T extends Record<string, any>>(
    ...pathSegmentsAndData: [...string[], T]
  ): Promise<ResultService<string>> => {
    try {
      const id = await setDocumentByPathFS<T>(...pathSegmentsAndData);
      return { success: true, data: id };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  /**
   * Elimina un documento en la ruta dada:
   * ...'colección','docId', etc
   */
  deleteDocumentByPath: async (
    ...pathSegments: string[]
  ): Promise<ResultService<null>> => {
    try {
      await deleteDocumentByPathFS(...pathSegments);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },
};
