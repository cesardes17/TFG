// src/services/firestoreService.ts

import { WhereFilterOp } from 'firebase/firestore';
import {
  deleteDocumentByPathFS,
  deleteField,
  getCollectionWithOptionsFS,
  getDocumentByPathFS,
  setDocumentByPathFS,
  updateDocumentByPathFS,
} from '../../api/firestoreFirebase';
import type { ResultService } from '../../types/ResultService';

export type WhereClause = [string, WhereFilterOp, any];
export type OrderClause = [string, 'asc' | 'desc'];

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
    pathSegments: string[],
    andFilters: WhereClause[] = [],
    orFilters: WhereClause[] = [],
    orderBy: OrderClause[] = [],
    limit?: number,
    startAfter?: any
  ): Promise<ResultService<T[]>> => {
    try {
      const data = await getCollectionWithOptionsFS<T>(
        pathSegments,
        andFilters,
        orFilters,
        orderBy,
        limit,
        startAfter
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
