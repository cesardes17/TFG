import { Jornada } from '../types/Jornada';
import { Partido } from '../types/Partido';
import { ResultService } from '../types/ResultService';
import { FirestoreService } from './core/firestoreService';
import { partidoService } from './partidoService';

export const jornadaService = {
  crear: async (
    temporadaId: string,
    competicionId: string,
    jornada: Jornada
  ): Promise<ResultService<null>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'jornadas',
      ];
      const jornadaRes = await FirestoreService.setDocumentByPath(
        ...path,
        jornada.id,
        jornada
      );
      if (!jornadaRes.success) {
        throw new Error(jornadaRes.errorMessage || 'Error al crear jornada');
      }
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear jornada',
        data: null,
      } as ResultService<null>;
    }
  },

  getAll: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<Jornada[]>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'jornadas',
      ];
      const jornadasRes = await FirestoreService.getCollectionByPath<Jornada>(
        path
      );
      if (!jornadasRes.success) {
        throw new Error(
          jornadasRes.errorMessage || 'Error al obtener jornadas'
        );
      }
      return {
        success: true,
        data: jornadasRes.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: 'Error al obtener jornadas',
      };
    }
  },

  finalizarJornadaSiEsNecesario: async (
    temporadaId: string,
    tipoCompeticion: string,
    jornadaId: string
  ): Promise<ResultService<boolean>> => {
    try {
      // 1️⃣ Obtener todos los partidos de la jornada usando el partidoService
      const partidosRes = await partidoService.getAllByJornada(
        temporadaId,
        tipoCompeticion,
        jornadaId
      );

      if (!partidosRes.success || !partidosRes.data) {
        throw new Error(
          partidosRes.errorMessage || 'Error al obtener partidos'
        );
      }

      const partidos = partidosRes.data;
      let todosFinalizados = true;

      for (const partido of partidos) {
        const esDescanso =
          partido.equipoLocal?.id === 'descansa' ||
          partido.equipoVisitante?.id === 'descansa';

        // 🔴 Si es un partido "descansa" y está pendiente, finalízalo automáticamente
        if (esDescanso && partido.estado !== 'finalizado') {
          partido.estado = 'finalizado';
          const resFinalizar = await partidoService.finalizarPartido(
            temporadaId,
            tipoCompeticion,
            partido
          );
          if (!resFinalizar.success) {
            throw new Error(
              resFinalizar.errorMessage || 'Error al finalizar partido descansa'
            );
          }
          console.log(
            `✅ Partido "descansa" finalizado automáticamente: ${partido.id}`
          );
        }

        // Si el partido no es "finalizado" y no es "descansa", la jornada no se finaliza aún
        if (partido.estado !== 'finalizado' && !esDescanso) {
          todosFinalizados = false;
          break;
        }
      }

      // 3️⃣ Si todos están finalizados, marcar la jornada como finalizada
      if (todosFinalizados) {
        const jornadaPath = [
          'temporadas',
          temporadaId,
          'competiciones',
          tipoCompeticion,
          'jornadas',
          jornadaId,
        ];
        const resFinalizarJornada = await FirestoreService.updateDocumentByPath(
          jornadaPath,
          {
            estado: 'finalizada',
          }
        );
        if (!resFinalizarJornada.success) {
          throw new Error(
            resFinalizarJornada.errorMessage ||
              'Error al finalizar jornada automáticamente'
          );
        }
        console.log(`🎉 Jornada ${jornadaId} marcada como finalizada.`);
        return { success: true, data: true };
      }

      return { success: true, data: false };
    } catch (error) {
      console.error('Error al finalizar jornada:', error);
      return {
        success: false,
        errorMessage: 'Error al finalizar jornada',
      };
    }
  },

  // src/services/jornadaService.ts

  getLastJornada: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<Jornada>> => {
    try {
      const path = [
        'temporadas',
        temporadaId,
        'competiciones',
        competicionId,
        'jornadas',
      ];

      // Orden descendente por número y limit 1
      const res = await FirestoreService.getCollectionByPath<Jornada>(
        path,
        [], // andFilters
        [], // orFilters
        [['numero', 'desc']], // 🔥 ordenar por número DESC para la última jornada
        1 // 🔥 solo la primera (la última en orden)
      );

      if (!res.success || !res.data || res.data.length === 0) {
        throw new Error('No se encontró la última jornada');
      }

      return {
        success: true,
        data: res.data[0],
      };
    } catch (error: any) {
      console.error('Error al obtener la última jornada:', error);
      return {
        success: false,
        errorMessage: error.message || 'Error al obtener la última jornada',
      };
    }
  },
};
