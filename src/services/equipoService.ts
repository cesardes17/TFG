import { TipoCompeticion } from '../types/Competicion';
import { Equipo } from '../types/Equipo';
import { EstadisticasEquipo } from '../types/estadisticas/equipo';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

const COLLECION = 'equipos';

export const equipoService = {
  crearEquipo: async (
    temporadaId: string,
    id: string,
    data: Equipo
  ): Promise<ResultService<string>> => {
    try {
      const path = ['temporadas', temporadaId, 'equipos', id];
      await FirestoreService.setDocumentByPath(...path, data);
      return {
        success: true,
        data: id,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al crear el equipo',
      };
    }
  },

  /**Obtiene el equipo */
  getEquipo: async (
    temporadaId: string,
    id: string
  ): Promise<ResultService<Equipo>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECION, id];
      const res = await FirestoreService.getDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener el equipo');
      }

      return {
        success: true,
        data: res.data as Equipo,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al crear el equipo',
      };
    }
  },

  getEquipos: async (temporadaId: string): Promise<ResultService<Equipo[]>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECION];
      const res = await FirestoreService.getCollectionByPath(path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener los equipos');
      }
      return {
        success: true,
        data: res.data as Equipo[],
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener los equipos',
      };
    }
  },

  deleteEquipo: async (
    temporadaId: string,
    id: string
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECION, id];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al eliminar el equipo');
      }
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al eliminar el equipo',
      };
    }
  },
  actualizarEstadisticasEquipo: async (
    temporadaId: string,
    equipoId: string,
    tipoCompeticion: TipoCompeticion,
    estadisticasNuevas: EstadisticasEquipo
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECION, equipoId];
      const res = await FirestoreService.getDocumentByPath(...path);

      let equipo: Equipo;
      if (res.success && res.data) {
        equipo = res.data as Equipo;
      } else {
        throw new Error('No se encontró el equipo');
      }

      // Determinar la propiedad correcta según el tipo de competición
      const key =
        tipoCompeticion === 'liga-regular'
          ? 'estadisticasLigaRegular'
          : tipoCompeticion === 'copa'
          ? 'estadisticasCopa'
          : 'estadisticasPlayoff';

      // Inicializar si no existe
      if (!equipo[key]) {
        equipo[key] = crearEstadisticasBase();
      }

      // Sumar estadísticas
      equipo[key] = sumarEstadisticas(equipo[key]!, estadisticasNuevas);

      // Actualizar en Firestore
      const updateRes = await FirestoreService.setDocumentByPath(
        ...path,
        equipo
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
            : 'Error al actualizar estadísticas del equipo',
      };
    }
  },
};

/** Suma estadísticas de equipo de forma acumulativa */
function sumarEstadisticas(
  prev: EstadisticasEquipo,
  nueva: EstadisticasEquipo
): EstadisticasEquipo {
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
    tiemposMuertos: prev.tiemposMuertos + nueva.tiemposMuertos,
  };
}

/** Inicializa estadísticas vacías */
function crearEstadisticasBase(): EstadisticasEquipo {
  return {
    puntos: 0,
    asistencias: 0,
    rebotes: 0,
    faltasCometidas: 0,
    tirosLibres: { anotados: 0, fallados: 0 },
    tirosDos: { anotados: 0, fallados: 0 },
    tirosTres: { anotados: 0, fallados: 0 },
    tiemposMuertos: 0,
  };
}
