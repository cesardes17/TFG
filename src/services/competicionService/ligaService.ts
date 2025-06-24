// src/services/competitionService/ligaService.ts

import { EquipoEstado } from '../../hooks/useEquiposConEstado';
import { Clasificacion } from '../../types/Clasificacion';
import { Competicion } from '../../types/Competicion';
import { Partido } from '../../types/Partido';
import { ResultService } from '../../types/ResultService';
import { generarCalendarioLiga } from '../../utils/calendario/generarJornadas';
import { disolverEquipo } from '../../utils/equipos/disolverEquipo';
import { clasificacionService } from '../clasificacionService';
import { jornadaService } from '../jornadaService';
import { partidoService } from '../partidoService';
import { competitionBaseService } from './baseService';

const ID_LIGA_REGULAR = 'liga-regular';

export const ligaService = {
  crear: async (
    temporadaId: string,
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
      const liga: Competicion = {
        id: ID_LIGA_REGULAR,
        nombre: 'Liga Regular',
        tipo: 'liga-regular',
        estado: 'en-curso',
        fechaInicio: new Date(),
      };

      const resCompeticion = await competitionBaseService.crearCompeticion(
        temporadaId,
        ID_LIGA_REGULAR,
        liga
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

      const { jornadas, partidosPorJornada } = await generarCalendarioLiga(
        equiposCompletos,
        onProgress
      );

      // Guardar jornadas y partidos en base de datos
      for (const jornada of jornadas) {
        await jornadaService.crear(temporadaId, ID_LIGA_REGULAR, jornada);
        const partidos = partidosPorJornada[jornada.id] || [];
        for (const partido of partidos) {
          await partidoService.crear(temporadaId, ID_LIGA_REGULAR, partido);
        }
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

  onFinalizarPartido: async (
    temporadaId: string,
    partido: Partido
  ): Promise<ResultService<null>> => {
    try {
      const puntosLocal = partido.estadisticasEquipos!.totales.local.puntos;
      const puntosVisitante =
        partido.estadisticasEquipos!.totales.visitante.puntos;

      const baseLocal: Clasificacion = {
        id: partido.equipoLocal.id,
        equipo: partido.equipoLocal,
        puntosFavor: puntosLocal,
        puntosContra: puntosVisitante,
        partidosJugados: 1,
        victorias: 0,
        derrotas: 0,
        puntos: 1, // Por defecto 1 punto (derrota)
        diferencia: puntosLocal - puntosVisitante,
      };

      const baseVisitante: Clasificacion = {
        id: partido.equipoVisitante.id,
        equipo: partido.equipoVisitante,
        puntosFavor: puntosVisitante,
        puntosContra: puntosLocal,
        partidosJugados: 1,
        victorias: 0,
        derrotas: 0,
        puntos: 1, // Por defecto 1 punto (derrota)
        diferencia: puntosVisitante - puntosLocal,
      };

      if (puntosLocal > puntosVisitante) {
        baseLocal.victorias = 1;
        baseVisitante.derrotas = 1;
        baseLocal.puntos = 2;
      } else {
        baseVisitante.victorias = 1;
        baseLocal.derrotas = 1;
        baseVisitante.puntos = 2;
      }
      // Actualizar clasificación de forma acumulativa
      const resLocal =
        await clasificacionService.actualizarClasificacionAcumulativa(
          temporadaId,
          ID_LIGA_REGULAR,
          baseLocal
        );
      const resVisitante =
        await clasificacionService.actualizarClasificacionAcumulativa(
          temporadaId,
          ID_LIGA_REGULAR,
          baseVisitante
        );
      if (!resLocal.success || !resVisitante.success) {
        return {
          success: false,
          errorMessage: 'Error al actualizar clasificación acumulada',
        };
      }

      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  },

  pausar: async (temporadaId: string): Promise<ResultService<boolean>> => {
    return competitionBaseService.pausarCompetcion(
      temporadaId,
      ID_LIGA_REGULAR
    );
  },

  reanudar: async (temporadaId: string): Promise<ResultService<boolean>> => {
    return competitionBaseService.reanudarCompeticion(
      temporadaId,
      ID_LIGA_REGULAR
    );
  },
};
