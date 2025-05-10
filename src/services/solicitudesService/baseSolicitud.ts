// src/services/solicitud/BaseSolicitudService.ts

import { ResultService } from '../../types/ResultService';
import { Solicitud } from '../../types/Solicitud';
import { FirestoreService } from '../core/firestoreService';
import { StorageService } from '../core/storageService';

const COLLECTION = 'solicitudes';

export const BaseSolicitudService = {
  /** Crea una nueva solicitud */
  setSolicitud: async (
    temporadaId: string,
    id: string,
    data: Solicitud
  ): Promise<ResultService<string>> => {
    try {
      const path = ['temporadas', temporadaId, COLLECTION, id];
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
      return FirestoreService.setDocumentByPath<Solicitud>(...path, data);
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

  /** Obtiene todas las solicitudes (o filtra según condiciones) */
  getSolicitudes: async (
    temporadaId: string
  ): Promise<ResultService<Solicitud[]>> => {
    const path = ['temporadas', temporadaId, COLLECTION];
    const res = await FirestoreService.getDocumentsWithFilterByPath<Solicitud>(
      [],
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
};
