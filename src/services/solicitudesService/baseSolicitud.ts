// src/services/solicitud/BaseSolicitudService.ts

import { ResultService } from '../../types/ResultService';
import { Solicitud } from '../../types/Solicitud';
import { FirestoreService } from '../core/firestoreService';
import { StorageService } from '../core/storageService';
import { aceptarCrearEquipoSolicitud } from './createTeamSolicitud/aceptar';
import { rechazarCrearEquipoSolicitud } from './createTeamSolicitud/rechazar';

const COLLECTION = 'solicitudes';

export const BaseSolicitudService = {
  /** Crea una nueva solicitud */
  setSolicitud: async (
    temporadaId: string,
    id: string,
    data: Solicitud
  ): Promise<ResultService<string>> => {
    try {
      if (data.escudoUrl && !data.escudoUrl.startsWith('http')) {
        const res = await StorageService.uploadFile(
          'escudos_equipos',
          data.escudoUrl
        );
        if (!res.success || !res.data) {
          throw new Error(res.errorMessage || 'Error al subir el archivo');
        }
        data.escudoUrl = res.data;
      }
      const path = ['temporadas', temporadaId, COLLECTION, id];
      const resSol = await FirestoreService.setDocumentByPath(...path, data);
      if (!resSol.success) {
        throw new Error(resSol.errorMessage || 'Error al crear la solicitud');
      }
      return {
        success: true,
        data: resSol.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al crear la solicitud',
      };
    }
  },

  /** Obtiene todas las solicitudes (o filtra según condiciones)
   * @param temporadaId ID de la temporada
   * @param estado Estado de la solicitud (pendiente, aceptada, rechazada). Por defecto, solo obtiene las pendientes
   */
  getSolicitudes: async (
    temporadaId: string,
    estado: string = 'pendiente'
  ): Promise<ResultService<Solicitud[]>> => {
    const path = ['temporadas', temporadaId, COLLECTION];
    const res = await FirestoreService.getDocumentsWithFilterByPath<Solicitud>(
      [['estado', '==', estado]],
      [],
      ...path
    );
    console.log(res);
    return {
      success: res.success,
      data: res.data,
      errorMessage: res.errorMessage,
    };
  },

  /** Elimina una solicitud por su ID */
  deleteSolicitud: async (id: string): Promise<ResultService<null>> => {
    return FirestoreService.deleteDocumentByPath(COLLECTION, id);
  },

  /** Rechaza una solicitud */
  rechazarSolicitud: async (
    temporadaId: string,
    data: Solicitud
  ): Promise<ResultService<null>> => {
    try {
      switch (data.tipo) {
        case 'Crear Equipo':
          const res = await rechazarCrearEquipoSolicitud(temporadaId, data);

          if (!res.success) {
            throw new Error(
              res.errorMessage || 'Error al rechazar la solicitud'
            );
          }
          break;

        default:
          return {
            success: false,
            errorMessage: 'Tipo de solicitud no reconocido',
          };
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
            : 'Error desconocido al rechazar la solicitud',
      };
    }
  },
};
