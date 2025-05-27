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
      return res;
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
};
