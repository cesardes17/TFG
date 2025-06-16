// src/services/temporadaService.ts
import type { ResultService } from '../types/ResultService';
import type { Temporada } from '../types/Temporada';
import { getRandomUID } from '../utils/getRandomUID';
import { FirestoreService, WhereClause } from './core/firestoreService';

export const temporadaService = {
  /**
   * Obtiene la temporada activa (activa === true) de la colección 'temporadas'
   */
  getTemporadaActual: async (): Promise<ResultService<Temporada>> => {
    try {
      // Filtros AND sobre la colección raíz
      const andFilters: WhereClause[] = [['activa', '==', true]];

      // Recuperamos las temporadas activas
      const res = await FirestoreService.getCollectionByPath<
        Temporada & { id: string }
      >(
        ['temporadas'], // pathSegments
        andFilters
      );

      if (!res.success || !res.data || res.data.length === 0) {
        return {
          success: false,
          errorMessage: 'No se encontró una temporada activa',
        };
      }

      // Devolvemos el primer elemento
      return {
        success: true,
        data: res.data[0],
      };
    } catch (error: any) {
      console.error('Error al obtener temporada activa:', error);
      return {
        success: false,
        errorMessage: 'ERROR_GET_TEMPORADA_ACTUAL',
      };
    }
  },

  /**
   * Crea una nueva temporada con nombre automático e inserta el documento en Firestore
   */
  createTemporada: async (): Promise<ResultService<Temporada>> => {
    try {
      const resTempActual = await temporadaService.getTemporadaActual();

      if (resTempActual.data) {
        return {
          success: false,
          errorMessage:
            'Ya existe una temporada activa, finalizala antes de crear una nueva',
        };
      }

      const temporadaID = getRandomUID();
      const fechaAhora = new Date();

      const temporadaData: Temporada = {
        id: temporadaID,
        nombre: getNombreTemporadaActual(),
        fechaInicio: fechaAhora,
        fechaFin: null,
        activa: true,
      };

      // Insertamos con setByPath en 'temporadas/{temporadaID}'
      const res = await FirestoreService.setDocumentByPath<Temporada>(
        'temporadas', // colección
        temporadaID, // ID del documento
        temporadaData // payload
      );
      if (!res.success || !res.data) {
        throw new Error(res.errorMessage || 'Error al crear la temporada');
      }

      return {
        success: true,
        data: temporadaData,
      };
    } catch (error: any) {
      console.error('Error al crear la temporada:', error);
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al crear la temporada',
      };
    }
  },

  /**
   * Finaliza la temporada actual (activa === true)
   */
  finalizarTemporadaActual: async (): Promise<ResultService<Temporada>> => {
    try {
      const resTempActual = await temporadaService.getTemporadaActual();
      if (!resTempActual.success) {
        throw new Error(resTempActual.errorMessage);
      }
      if (!resTempActual.data) {
        return {
          success: false,
          errorMessage: 'No se encontró una temporada activa',
        };
      }
      const temporadaData = resTempActual.data;
      temporadaData.fechaFin = new Date();
      temporadaData.activa = false;
      // Actualizamos con updateByPath en 'temporadas/{temporadaID}'
      const res = await FirestoreService.updateDocumentByPath(
        ['temporadas', temporadaData.id], // colección
        temporadaData
      );
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al finalizar la temporada');
      }
      return {
        success: true,
        data: temporadaData,
      };
    } catch (error: any) {
      console.error('Error al finalizar la temporada:', error);
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al finalizar la temporada',
      };
    }
  },
};

/**
 * Genera un identificador para la nueva temporada según año actual
 * → e.g. 'Temporada 24/25' para el curso que arranca en 2024 y acaba en 2025
 */
const getNombreTemporadaActual = (): string => {
  const hoy = new Date();
  const añoActual = hoy.getFullYear();
  const añoInicio = String(añoActual).slice(-2);
  const añoFin = String(añoActual + 1).slice(-2);
  return `Temporada ${añoInicio}/${añoFin}`;
};
