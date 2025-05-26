// src/services/competitionService/ligaService.ts

import { EquipoEstado } from '../../hooks/useEquiposConEstado';
import { Clasificacion } from '../../types/Clasificacion';
import { Competicion } from '../../types/Competicion';
import { ResultService } from '../../types/ResultService';
import { disolverEquipo } from '../../utils/equipos/disolverEquipo';
import { clasificacionService } from '../clasificacionService';
import { competitionBaseService } from './baseService';

const ID_LIGA_REGULAR = 'liga-regular';

export const ligaService = {
  crear: async (
    temporadaId: string,
    data: Competicion,
    equiposIncompletos: string[],
    equiposCompletos: { id: string; nombre: string; escudoUrl: string }[],
    onProgress?: (text: string) => void
  ): Promise<ResultService<null>> => {
    try {
      //Si hay equipos incompletos, estos se disuelven
      if (equiposIncompletos.length > 0) {
        equiposIncompletos.forEach(async (equipoId) => {
          await disolverEquipo(temporadaId, equipoId, onProgress);
        });
      }
      const resCompeticion = await competitionBaseService.crearCompeticion(
        temporadaId,
        ID_LIGA_REGULAR,
        data
      );
      if (!resCompeticion.success) {
        return {
          success: false,
          errorMessage: 'Error al crear competicion',
        };
      }

      const resClasificacion = await clasificacionService.crear(
        temporadaId,
        ID_LIGA_REGULAR,
        equiposCompletos
      );
      if (!resClasificacion.success) {
        return {
          success: false,
          errorMessage: 'Error al crear clasificacion',
        };
      }

      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        errorMessage: 'Error al disolver equipos incompletos',
      };
    }
  },

  obtener: async (temporadaId: string): Promise<ResultService<Competicion>> => {
    return competitionBaseService.getCompeticion(temporadaId, ID_LIGA_REGULAR);
  },

  actualizar: async (
    temporadaId: string,
    data: Partial<Competicion>
  ): Promise<ResultService<null>> => {
    return competitionBaseService.actualizarCompeticion(
      temporadaId,
      ID_LIGA_REGULAR,
      data
    );
  },

  eliminar: async (temporadaId: string): Promise<ResultService<null>> => {
    return competitionBaseService.eliminarCompeticion(
      temporadaId,
      ID_LIGA_REGULAR
    );
  },
};
