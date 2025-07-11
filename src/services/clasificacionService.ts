import { Clasificacion } from '../types/Clasificacion';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';

export const clasificacionService = {
  crear: async (
    temporadaId: string,
    competicionId: string,
    equipos: { id: string; nombre: string; escudoUrl: string }[]
  ): Promise<ResultService<null>> => {
    try {
      const pathBase = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'clasificacion',
      ];

      for (const equipo of equipos) {
        const clasificacion: Clasificacion = {
          id: equipo.id, // usamos el id del equipo como id del doc
          equipo,
          puntos: 0,
          partidosJugados: 0,
          victorias: 0,
          derrotas: 0,
          puntosFavor: 0,
          puntosContra: 0,
          diferencia: 0,
        };

        const res = await FirestoreService.setDocumentByPath(
          ...pathBase,
          clasificacion.id,
          clasificacion
        );

        if (!res.success) {
          throw new Error(res.errorMessage);
        }
      }

      return {
        success: true,
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al crear clasificación',
      };
    }
  },
  get: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<Clasificacion[]>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'clasificacion',
      ];

      const res: ResultService<Clasificacion[]> =
        await FirestoreService.getCollectionByPath<Clasificacion>(
          path,
          [],
          [],
          [['puntos', 'desc']]
        );

      if (!res.success) {
        throw new Error(res.errorMessage);
      }
      const ordenado = res.data!.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia;
        return a.equipo.nombre.localeCompare(b.equipo.nombre);
      });
      return {
        success: true,
        data: ordenado,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener clasificación',
      };
    }
  },

  actualizarClasificacionAcumulativa: async (
    temporadaId: string,
    competicionId: string,
    clasificacionBase: Clasificacion
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'clasificacion',
        clasificacionBase.equipo.id,
      ];

      // Obtener la clasificación actual
      const resGet = await FirestoreService.getDocumentByPath<Clasificacion>(
        ...path
      );

      if (!resGet.success || !resGet.data) {
        return {
          success: false,
          errorMessage: 'No se pudo obtener la clasificación actual del equipo',
        };
      }

      const clasificacionActual = resGet.data;

      // Crear la nueva clasificación acumulada
      const nuevaClasificacion: Clasificacion = {
        ...clasificacionActual,
        puntos: clasificacionActual.puntos + clasificacionBase.puntos,
        partidosJugados:
          clasificacionActual.partidosJugados +
          clasificacionBase.partidosJugados,
        victorias: clasificacionActual.victorias + clasificacionBase.victorias,
        derrotas: clasificacionActual.derrotas + clasificacionBase.derrotas,
        puntosFavor:
          clasificacionActual.puntosFavor + clasificacionBase.puntosFavor,
        puntosContra:
          clasificacionActual.puntosContra + clasificacionBase.puntosContra,
        diferencia:
          clasificacionActual.diferencia +
          (clasificacionBase.puntosFavor - clasificacionBase.puntosContra),
      };

      // Guardar la nueva clasificación
      const resUpdate = await FirestoreService.setDocumentByPath(
        ...path,
        nuevaClasificacion
      );

      if (!resUpdate.success) {
        return {
          success: false,
          errorMessage: 'Error al actualizar la clasificación en Firestore',
        };
      }

      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error desconocido al actualizar la clasificación',
      };
    }
  },
};
