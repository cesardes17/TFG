// src/services/realtimeService.ts
import {
  getValueRT,
  onValueRT,
  removeValueRT,
  setValueRT,
  updateValueRT,
} from '../../api/realtimeFirebase';
import { ResultService } from '../../types/ResultService';

/**
 * Métodos genéricos para leer/escribir/escuchar en Realtime Database
 * (Web | React-Native) de forma unificada.
 */
export const RealtimeService = {
  setValue: async <T>(
    pathSegments: string[],
    value: T
  ): Promise<ResultService<null>> => {
    try {
      await setValueRT(pathSegments, value);
      return { success: true, data: null };
    } catch (e: any) {
      return { success: false, errorMessage: e.message };
    }
  },

  updateValue: async <T>(
    pathSegments: string[],
    updates: Partial<T>
  ): Promise<ResultService<null>> => {
    try {
      await updateValueRT(pathSegments, updates);
      return { success: true, data: null };
    } catch (e: any) {
      return { success: false, errorMessage: e.message };
    }
  },

  removeValue: async (pathSegments: string[]): Promise<ResultService<null>> => {
    try {
      await removeValueRT(pathSegments);
      return { success: true, data: null };
    } catch (e: any) {
      return { success: false, errorMessage: e.message };
    }
  },

  getValue: async <T>(
    pathSegments: string[]
  ): Promise<ResultService<T | null>> => {
    try {
      const data = await getValueRT<T>(pathSegments);
      return { success: true, data };
    } catch (e: any) {
      return { success: false, errorMessage: e.message };
    }
  },

  onValue: async <T>(
    pathSegments: string[],
    callback: (val: T | null) => void
  ): Promise<() => void> => {
    // Devuelve la función para desenlazar
    return await onValueRT<T>(pathSegments, callback);
  },
};
