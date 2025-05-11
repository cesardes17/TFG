// src/services/solicitudesService/baseSolicitud.ts

import {
  getCollectionByPathFS,
  getDocumentByPathFS,
  setDocumentByPathFS,
  deleteDocumentByPathFS,
  getCollectionByPathWithFilterFS,
} from '../../api/firestoreFirebase';
import type { ResultService } from '../../types/ResultService';
import type { Solicitud } from '../../types/Solicitud';
import { StorageService } from '../core/storageService';

export const BaseSolicitudService = {
  /** Listar todas las solicitudes de una subcolección: temporadas/{id}/solicitudes */
  async getSolicitudes(
    temporadaId: string
  ): Promise<ResultService<Solicitud[]>> {
    try {
      const data = await getCollectionByPathWithFilterFS<Solicitud>(
        [['estado', '==', 'pendiente']],
        [],
        'temporadas',
        temporadaId,
        'solicitudes'
      );
      return { success: true, data };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },

  /** Crear o actualizar una solicitud en temporadas/{temporadaId}/solicitudes/{solicitudId} */
  async setSolicitud(
    temporadaId: string,
    solicitudId: string,
    payload: Partial<Solicitud>
  ): Promise<ResultService<string>> {
    try {
      console.log(payload);
      if (payload.escudoUrl && !payload.escudoUrl.startsWith('http')) {
        const imageRes = await StorageService.uploadFile(
          'escudos_equipos',
          payload.escudoUrl
        );
        if (!imageRes.success) {
          throw new Error(imageRes.errorMessage || 'Error al subir la imagen');
        }
        payload.escudoUrl = imageRes.data;
      }

      const id = await setDocumentByPathFS(
        'temporadas',
        temporadaId,
        'solicitudes',
        solicitudId,
        payload
      );
      return { success: true, data: id };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },

  /** Borrar una solicitud concreta */
  async deleteSolicitud(
    temporadaId: string,
    solicitudId: string
  ): Promise<ResultService<null>> {
    try {
      await deleteDocumentByPathFS(
        'temporadas',
        temporadaId,
        'solicitudes',
        solicitudId
      );
      return { success: true, data: null };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },
};
