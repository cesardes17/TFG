import { TipoCompeticion } from '../types/Competicion';
import {
  DocumentoEstadisticasJugador,
  EstadisticasSimpleJugador,
} from '../types/estadisticas/jugador';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

const COLLECTION_NAME = 'estadisticas';

export const jugadorEstadisticasService = {
  getEstadisticasJugadorPorTemporada: async (
    jugadorId: string,
    temporadaId: string
  ): Promise<ResultService<DocumentoEstadisticasJugador | null>> => {
    try {
      const path = ['users', jugadorId, COLLECTION_NAME, temporadaId];
      const res =
        await FirestoreService.getDocumentByPath<DocumentoEstadisticasJugador>(
          ...path
        );
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al leer estadísticas');
      }
      // Si no existe el doc, data será null
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener estadísticas del jugador',
      };
    }
  },

  actualizarEstadisticasJugador: async (
    jugadorId: string,
    temporadaId: string,
    tipoCompeticion: TipoCompeticion,
    estadisticasNuevas: EstadisticasSimpleJugador
  ): Promise<ResultService<null>> => {
    try {
      const path = ['users', jugadorId, COLLECTION_NAME, temporadaId];
      const res =
        await FirestoreService.getDocumentByPath<DocumentoEstadisticasJugador>(
          ...path
        );

      console.log('res', res);

      // 1️⃣ Base
      let actuales: DocumentoEstadisticasJugador = {
        estadisticasLiga: crearEstadisticasBase(),
        estadisticasCopa: crearEstadisticasBase(),
        estadisticasPlayoff: crearEstadisticasBase(),
      };

      // 2️⃣ Si ya existía, cargamos valores anteriores
      if (res.success && res.data) {
        actuales = {
          estadisticasLiga:
            res.data.estadisticasLiga ?? crearEstadisticasBase(),
          estadisticasCopa:
            res.data.estadisticasCopa ?? crearEstadisticasBase(),
          estadisticasPlayoff:
            res.data.estadisticasPlayoff ?? crearEstadisticasBase(),
        };
      }

      // 3️⃣ Elegir clave
      const key: keyof DocumentoEstadisticasJugador =
        tipoCompeticion === 'liga-regular'
          ? 'estadisticasLiga'
          : tipoCompeticion === 'copa'
          ? 'estadisticasCopa'
          : 'estadisticasPlayoff';

      // 4️⃣ Sumar
      actuales[key] = sumarEstadisticas(actuales[key], estadisticasNuevas);

      // 5️⃣ Upsert completo con setDocumentByPath (créa o reemplaza)
      const resActualizar = await FirestoreService.setDocumentByPath(
        ...path,
        actuales
      );
      if (!resActualizar.success) {
        throw new Error(resActualizar.errorMessage || 'Error al actualizar');
      }
      return { success: true, data: null };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error actualizando estadísticas de jugador',
      };
    }
  },
};

// Helper: inicializa a cero
function crearEstadisticasBase(): EstadisticasSimpleJugador {
  return {
    puntos: 0,
    tirosLibres: { anotados: 0, fallados: 0 },
    tirosDos: { anotados: 0, fallados: 0 },
    tirosTres: { anotados: 0, fallados: 0 },
    asistencias: 0,
    rebotes: 0,
    faltasCometidas: 0,
    partidosJugados: 0,
  };
}

// Helper: suma dos estadísticas
function sumarEstadisticas(
  prev: EstadisticasSimpleJugador,
  nueva: EstadisticasSimpleJugador
): EstadisticasSimpleJugador {
  return {
    puntos: prev.puntos + nueva.puntos,
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
    asistencias: prev.asistencias + nueva.asistencias,
    rebotes: prev.rebotes + nueva.rebotes,
    faltasCometidas: prev.faltasCometidas + nueva.faltasCometidas,
    partidosJugados: prev.partidosJugados + 1,
  };
}
