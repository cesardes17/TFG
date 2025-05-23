// src/services/firestoreService.ts

import { WhereFilterOp, Timestamp } from 'firebase/firestore';
import {
  deleteDocumentByPathFS,
  deleteField,
  getCollectionWithOptionsFS,
  getDocumentByPathFS,
  setDocumentByPathFS,
  updateDocumentByPathFS,
} from '../../api/firestoreFirebase';
import type { ResultService } from '../../types/ResultService';
import { parseTimestamps, serializeDates } from '../../utils/ParseTimestamps';

export type WhereClause = [string, WhereFilterOp, any];
export type OrderClause = [string, 'asc' | 'desc'];

export const FirestoreService = {
  getDeleteField: () => deleteField(),

  async getDocumentByPath<T>(
    ...pathSegments: string[]
  ): Promise<ResultService<T | null>> {
    try {
      const raw = await getDocumentByPathFS<T>(...pathSegments);
      const data = raw != null ? await parseTimestamps(raw) : null;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  async getCollectionByPath<T>(
    pathSegments: string[],
    andFilters: WhereClause[] = [],
    orFilters: WhereClause[] = [],
    orderBy: OrderClause[] = [],
    limit?: number,
    startAfter?: any
  ): Promise<ResultService<T[]>> {
    try {
      const raw = await getCollectionWithOptionsFS<T>(
        pathSegments,
        andFilters,
        orFilters,
        orderBy,
        limit,
        startAfter
      );
      const data = raw.map(parseTimestamps);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  async setDocumentByPath<T extends Record<string, any>>(
    ...pathSegmentsAndData: [...string[], T]
  ): Promise<ResultService<string>> {
    try {
      const segments = pathSegmentsAndData.slice(0, -1) as string[];
      let payload = pathSegmentsAndData[pathSegmentsAndData.length - 1] as T;
      payload = await serializeDates(payload);
      const id = await setDocumentByPathFS<T>(...segments, payload);
      return { success: true, data: id };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  async updateDocumentByPath(
    pathSegments: string[],
    data: Record<string, any>
  ): Promise<ResultService<null>> {
    try {
      const payload = await serializeDates(data); // ✅ IMPORTANTE
      await updateDocumentByPathFS(pathSegments, payload);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  async deleteDocumentByPath(
    ...pathSegments: string[]
  ): Promise<ResultService<null>> {
    try {
      await deleteDocumentByPathFS(...pathSegments);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },
};
