// src/services/competitionService/baseService.ts
import { FirestoreService } from '../core/firestoreService';
import { Competicion } from '../../types/Competicion';
import { ResultService } from '../../types/ResultService';
import { jornadaService } from '../jornadaService';
import { Jornada } from '../../types/Jornada';

const COLLECTION = 'competiciones';

export const competitionBaseService = {
  crearCompeticion: async (
    temporadaId: string,
    competicionId: string,
    data: Competicion
  ): Promise<ResultService<string>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.setDocumentByPath(...path, data);
      return res;
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al crear la competición',
      };
    }
  },

  getCompeticion: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<Competicion>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.getDocumentByPath<Competicion>(
        ...path
      );
      if (!res.success || !res.data) {
        throw new Error(
          res.errorMessage || 'No se pudo obtener la competición'
        );
      }
      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener la competición',
      };
    }
  },

  actualizarCompeticion: async (
    temporadaId: string,
    competicionId: string,
    data: Partial<Competicion>
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.updateDocumentByPath(path, data);
      return res;
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar la competición',
      };
    }
  },

  eliminarCompeticion: async (
    temporadaId: string,
    competicionId: string
  ): Promise<ResultService<null>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, competicionId];
      const res = await FirestoreService.deleteDocumentByPath(...path);
      return res;
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al eliminar la competición',
      };
    }
  },
  getCompeticiones: async (
    temporadaId: string
  ): Promise<ResultService<Competicion[]>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION];
      const res = await FirestoreService.getCollectionByPath<Competicion>(path);
      if (!res.success || !res.data) {
        throw new Error(
          res.errorMessage || 'No se pudo obtener las competiciones'
        );
      }
      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener las competiciones',
      };
    }
  },

  finalizarCompeticionSiEsNecesario: async (
    temporadaId: string,
    tipoCompeticion: string
  ): Promise<ResultService<boolean>> => {
    try {
      // Obtener la última jornada de la competición
      const jornadaRes = await jornadaService.getLastJornada(
        temporadaId,
        tipoCompeticion
      );
      if (!jornadaRes.success || !jornadaRes.data) {
        throw new Error(
          jornadaRes.errorMessage || 'Error al obtener la última jornada'
        );
      }

      const ultimaJornada = jornadaRes.data;
      console.log('ultima Jornada', ultimaJornada);
      if (ultimaJornada.estado === 'finalizada') {
        // Actualizar el estado de la competición
        const competicionPath = [
          'temporadas',
          temporadaId,
          'competiciones',
          tipoCompeticion,
        ];
        const resFinalizarCompeticion =
          await FirestoreService.updateDocumentByPath(competicionPath, {
            estado: 'finalizada',
            fechaFin: new Date(),
          });

        if (!resFinalizarCompeticion.success) {
          throw new Error(
            resFinalizarCompeticion.errorMessage ||
              'Error al finalizar la competición'
          );
        }

        console.log(
          `🎉 Competición ${tipoCompeticion} marcada como finalizada.`
        );
        return { success: true, data: true };
      }

      return { success: true, data: false };
    } catch (error) {
      console.error('Error al finalizar competición:', error);
      return {
        success: false,
        errorMessage: 'Error al finalizar competición',
      };
    }
  },
};
