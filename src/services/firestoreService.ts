// src/services/firestoreService.ts
import {
  getDocumentFS,
  getDocumentsFS,
  setDocumentFS,
  updateDocumentFS,
  deleteDocumentFS,
} from '../api/firestoreFirebase';
import type { ResultService } from '../types/ResultService';

/**
 * High-level service for Firestore operations with unified results
 */
export const FirestoreService = {
  getDocument: async <T>(
    collection: string,
    id: string
  ): Promise<ResultService<T | null>> => {
    try {
      const data = await getDocumentFS<T>(collection, id);
      return { data, success: true };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error fetching document',
      };
    }
  },

  getCollection: async <T>(collection: string): Promise<ResultService<T[]>> => {
    try {
      const data = await getDocumentsFS<T>(collection);
      return { data, success: true };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error fetching collection',
      };
    }
  },

  setDocument: async <T extends Record<string, any>>(
    collection: string,
    data: T,
    id?: string
  ): Promise<ResultService<string>> => {
    try {
      const docId = await setDocumentFS<T>(collection, data, id);
      return { data: docId, success: true };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error setting document',
      };
    }
  },

  updateDocument: async <T extends Record<string, any>>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<ResultService<null>> => {
    try {
      await updateDocumentFS<T>(collection, id, data);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error updating document',
      };
    }
  },

  deleteDocument: async (
    collection: string,
    id: string
  ): Promise<ResultService<null>> => {
    try {
      await deleteDocumentFS(collection, id);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message || 'Error deleting document',
      };
    }
  },
};
