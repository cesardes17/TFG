// src/services/jugadorEstadisticasService.ts
import { TipoCompeticion } from '../types/Competicion';
import {
  DocumentoEstadisticasJugador,
  EstadisticasJugador,
  EstadisticasSimpleJugador,
} from '../types/estadisticas/jugador';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

const COLLECTION_NAME = 'estadisticas';

export const jugadorEstadisticasService = {
  /** Obtiene las estadísticas del jugador para una temporada */
  getEstadisticasJugador: async (
    jugadorId: string,
    temporadaId: string
  ): Promise<ResultService<DocumentoEstadisticasJugador | null>> => {
    try {
      const path = ['users', jugadorId, COLLECTION_NAME, temporadaId];
      const res = await FirestoreService.getDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener estadísticas');
      }
      return {
        success: true,
        data: res.data as DocumentoEstadisticasJugador,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener estadísticas',
      };
    }
  },

  /** Actualiza las estadísticas de un jugador de forma acumulativa */
  actualizarEstadisticasJugador: async (
    jugadorId: string,
    temporadaId: string,
    tipoCompeticion: TipoCompeticion,
    estadisticasNuevas: EstadisticasSimpleJugador
  ): Promise<ResultService<null>> => {
    try {
      const path = ['users', jugadorId, COLLECTION_NAME, temporadaId];
      const res = await FirestoreService.getDocumentByPath(...path);

      let estadisticasActuales: DocumentoEstadisticasJugador = {
        estadisticasLiga: crearEstadisticasBase(),
        estadisticasCopa: crearEstadisticasBase(),
        estadisticasPlayoff: crearEstadisticasBase(),
      };

      if (res.success && res.data) {
        estadisticasActuales = res.data as DocumentoEstadisticasJugador;
      }

      // Determinar qué campo actualizar: liga, copa o playoff
      const key =
        tipoCompeticion === 'liga-regular'
          ? 'estadisticasLiga'
          : tipoCompeticion === 'copa'
          ? 'estadisticasCopa'
          : 'estadisticasPlayoff';

      // Combinar estadísticas acumulativamente
      estadisticasActuales[key] = sumarEstadisticas(
        estadisticasActuales[key],
        estadisticasNuevas
      );

      // Actualizar el documento en Firestore
      const updateRes = await FirestoreService.setDocumentByPath(
        ...path,
        estadisticasActuales
      );

      if (!updateRes.success) {
        throw new Error(updateRes.errorMessage);
      }

      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar estadísticas del jugador',
      };
    }
  },
};

/** Utilidad para sumar estadísticas jugador */
function sumarEstadisticas(
  prev: EstadisticasSimpleJugador,
  nueva: EstadisticasSimpleJugador
): EstadisticasSimpleJugador {
  return {
    puntos: prev.puntos + nueva.puntos,
    asistencias: prev.asistencias + nueva.asistencias,
    rebotes: prev.rebotes + nueva.rebotes,
    faltasCometidas: prev.faltasCometidas + nueva.faltasCometidas,
    tirosLibres: {
      anotados: prev.tirosLibres.anotados + nueva.tirosLibres.anotados,
      fallados: prev.tirosLibres.fallados + nueva.tirosLibres.fallados,
    },
    tirosDos: {
      anotados: prev.tirosDos.anotados + nueva.tirosDos.anotados,
      fallados: prev.tirosDos.fallados + nueva.tirosDos.fallados,
    },
    tirosTres: {
      anotados: prev.tirosTres.anotados + nueva.tirosTres.anotados,
      fallados: prev.tirosTres.fallados + nueva.tirosTres.fallados,
    },
    partidosJugados: prev.partidosJugados + nueva.partidosJugados,
  };
}

/** Inicializa estadísticas vacías */
function crearEstadisticasBase(): EstadisticasSimpleJugador {
  return {
    puntos: 0,
    asistencias: 0,
    rebotes: 0,
    faltasCometidas: 0,
    tirosLibres: { anotados: 0, fallados: 0 },
    tirosDos: { anotados: 0, fallados: 0 },
    tirosTres: { anotados: 0, fallados: 0 },
    partidosJugados: 0,
  };
}
