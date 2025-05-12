// src/services/solicitudesService/baseSolicitud.ts

import { WhereFilterOp } from 'firebase/firestore';
import {
  getCollectionByPathFS,
  getDocumentByPathFS,
  setDocumentByPathFS,
  deleteDocumentByPathFS,
  getCollectionByPathWithFilterFS,
} from '../../api/firestoreFirebase';
import type { ResultService } from '../../types/ResultService';
import type { Solicitud, solicitudCrearEquipo } from '../../types/Solicitud';
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
      if (payload.tipo === 'Crear Equipo') {
        const imageRes = await StorageService.uploadFile(
          'escudos_equipos',
          (payload as solicitudCrearEquipo).escudoUrl
        );
        if (!imageRes.success) {
          throw new Error(imageRes.errorMessage || 'Error al subir la imagen');
        }
        (payload as solicitudCrearEquipo).escudoUrl = imageRes.data!;
      }

      console.log('Subiendo solicitud con ID:', solicitudId);
      console.log('Payload final:', payload);

      const id = await setDocumentByPathFS(
        'temporadas',
        temporadaId,
        'solicitudes',
        solicitudId,
        payload
      );

      console.log('Documento subido con ID:', id);
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

  /** Obtener solicitudes con filtros */
  async getSolicitudesWithFilters(
    temporadaId: string,
    andFilters: [string, WhereFilterOp, any][] = [],
    orFilters: [string, WhereFilterOp, any][] = []
  ): Promise<ResultService<Solicitud[]>> {
    try {
      const path = ['temporadas', temporadaId, 'solicitudes'];
      const data = await getCollectionByPathWithFilterFS<Solicitud>(
        andFilters,
        orFilters,
        ...path
      );
      return { success: true, data };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || 'Error al obtener solicitudes',
      };
    }
  },
};
