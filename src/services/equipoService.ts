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

  /**
   * Acumula y guarda las estadísticas de equipo para la temporada,
   * en la subpropiedad correspondiente según la competición.
   */
  actualizarEstadisticasEquipo: async (
    temporadaId: string,
    equipoId: string,
    tipoCompeticion: TipoCompeticion,
    estadisticasNuevas: EstadisticasEquipo
  ): Promise<ResultService<null>> => {
    try {
      // Ruta al documento del equipo
      const path = ['temporadas', temporadaId, COLLECION, equipoId];

      // 1️⃣ Leer el equipo
      const resGet = await FirestoreService.getDocumentByPath<Equipo>(...path);
      if (!resGet.success || !resGet.data) {
        throw new Error(resGet.errorMessage || 'Equipo no encontrado');
      }
      const equipo = resGet.data;

      // 2️⃣ Decidir qué campo toca: ligaRegular, copa o playoff
      const key =
        tipoCompeticion === 'liga-regular'
          ? 'estadisticasLigaRegular'
          : tipoCompeticion === 'copa'
          ? 'estadisticasCopa'
          : 'estadisticasPlayoff';

      // 3️⃣ Inicializar base si hace falta
      const prevStats = equipo[key] ?? crearEstadisticasBase();

      // 4️⃣ Sumar acumulado
      const updatedStats = sumarEstadisticas(prevStats, estadisticasNuevas);

      // 5️⃣ Escribir solo ese campo
      const updatePayload = { [key]: updatedStats };
      const resUpd = await FirestoreService.updateDocumentByPath(
        path,
        updatePayload
      );
      if (!resUpd.success) {
        throw new Error(resUpd.errorMessage);
      }

      return { success: true, data: null };
    } catch (error: any) {
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
