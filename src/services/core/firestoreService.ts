// src/services/firestoreService.ts

import {
  deleteDocumentByPathFS,
  deleteField,
  getCollectionByPathFS,
  getCollectionByPathWithFilterFS,
  getDocumentByPathFS,
  setDocumentByPathFS,
  updateDocumentByPathFS,
} from '../../api/firestoreFirebase';
import type { ResultService } from '../../types/ResultService';

/**
 * Servicio unificado para Firestore con rutas dinámicas
 */
export const FirestoreService = {
  /**
   * Devuelve el valor especial para eliminar un campo en Firestore
   */
  getDeleteField: () => deleteField(),

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
   * Obtiene documentos con filtros en una ruta dada:
   * filters: [['field','==',value],...]
   * pathSegments: ... 'colección','docId','subcolección', etc
   */
  getDocumentsWithFilterByPath: async <T>(
    andFilters: [string, import('firebase/firestore').WhereFilterOp, any][],
    orFilters: [string, import('firebase/firestore').WhereFilterOp, any][],
    ...pathSegments: string[]
  ): Promise<ResultService<T[]>> => {
    try {
      const data = await getCollectionByPathWithFilterFS<T>(
        andFilters,
        orFilters,
        ...pathSegments
      );
      return { success: true, data };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  /**
   * Crea o reemplaza un documento en la ruta dada.
   * El payload debe ser el último argumento.
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
   * Actualiza campos específicos de un documento sin sobrescribirlo por completo
   */
  updateDocumentByPath: async (
    pathSegments: string[],
    data: Record<string, any>
  ): Promise<ResultService<null>> => {
    try {
      await updateDocumentByPathFS(pathSegments, data);
      return { success: true, data: null };
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
