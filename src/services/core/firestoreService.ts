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

export type WhereClause = [string, WhereFilterOp, any];
export type OrderClause = [string, 'asc' | 'desc'];

/**
 * Recorre recursivamente y convierte JS Date → Firestore Timestamp
 */
function serializeDates(obj: any): any {
  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeDates);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeDates(v)])
    );
  }
  return obj;
}

/**
 * Recorre recursivamente y convierte Firestore Timestamp → JS Date
 */
function parseTimestamps(obj: any): any {
  if (obj instanceof Timestamp) {
    return obj.toDate();
  }
  if (Array.isArray(obj)) {
    return obj.map(parseTimestamps);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, parseTimestamps(v)])
    );
  }
  return obj;
}

export const FirestoreService = {
  getDeleteField: () => deleteField(),

  async getDocumentByPath<T>(
    ...pathSegments: string[]
  ): Promise<ResultService<T | null>> {
    try {
      const raw = await getDocumentByPathFS<T>(...pathSegments);
      const data = raw != null ? parseTimestamps(raw) : null;
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
      payload = serializeDates(payload);
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
      const payload = serializeDates(data);
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
