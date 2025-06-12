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

      console.log(
        '🚀 ~ file: jugadorEstadisticasService.ts:26 ~ jugadorEstadisticasService ~ actualizarEstadisticasJugador: ~ obtencion de datos del path' +
          path +
          ': ',
        res.data
      );
      // 1️⃣ Partimos de un objeto con todas las estadísticas base
      let actuales: DocumentoEstadisticasJugador = {
        estadisticasLiga: crearEstadisticasBase(),
        estadisticasCopa: crearEstadisticasBase(),
        estadisticasPlayoff: crearEstadisticasBase(),
      };

      // 2️⃣ Si ya existía el documento, sobreescribimos sólo las propiedades que sí vinieran
      if (res.success && res.data) {
        const prev = res.data;
        actuales = {
          estadisticasLiga: prev.estadisticasLiga ?? crearEstadisticasBase(),
          estadisticasCopa: prev.estadisticasCopa ?? crearEstadisticasBase(),
          estadisticasPlayoff:
            prev.estadisticasPlayoff ?? crearEstadisticasBase(),
        };
      }

      // 3️⃣ Elegimos la clave que toca actualizar
      const key: keyof DocumentoEstadisticasJugador =
        tipoCompeticion === 'liga-regular'
          ? 'estadisticasLiga'
          : tipoCompeticion === 'copa'
          ? 'estadisticasCopa'
          : 'estadisticasPlayoff';

      // 4️⃣ Sumamos acumulativamente
      const combinadas = sumarEstadisticas(actuales[key], estadisticasNuevas);
      actuales[key] = combinadas;

      // 5️⃣ Guardamos de forma parcial sólo esa subpropiedad
      await FirestoreService.updateDocumentByPath(path, { [key]: combinadas });

      return { success: true, data: null };
    } catch (error: any) {
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
