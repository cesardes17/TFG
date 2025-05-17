// src/services/solicitudesService/baseSolicitud.ts

import { WhereFilterOp } from 'firebase/firestore';

import type { ResultService } from '../../types/ResultService';
import type { Solicitud, solicitudCrearEquipo } from '../../types/Solicitud';
import { StorageService } from '../core/storageService';
import { User } from '../../types/User';
import { FirestoreService, WhereClause } from '../core/firestoreService';

export const BaseSolicitudService = {
  /** Listar todas las solicitudes de una subcolección: temporadas/{id}/solicitudes */
  getSolicitudes: async (
    temporadaId: string
  ): Promise<ResultService<Solicitud[]>> => {
    try {
      const pathSegments = ['temporadas', temporadaId, 'solicitudes'];
      // Si quisieras filtrar solo pendientes:
      // const andFilters: [string, WhereFilterOp, any][] = [['estado', '==', 'pendiente']];
      // Por ahora recuperamos todas:
      const andFilters: WhereClause[] = [];

      const res = await FirestoreService.getCollectionByPath<Solicitud>(
        pathSegments,
        andFilters
      );

      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener las solicitudes');
      }

      return { success: true, data: res.data };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },

  /** Crear o actualizar una solicitud en temporadas/{temporadaId}/solicitudes/{solicitudId} */
  setSolicitud: async (
    temporadaId: string,
    solicitudId: string,
    payload: Partial<Solicitud>
  ): Promise<ResultService<string>> => {
    try {
      // Si es tipo "Crear Equipo", subimos primero el escudo y actualizamos la URL
      if (payload.tipo === 'Crear Equipo') {
        const equipoPayload = payload as solicitudCrearEquipo;
        const imageRes = await StorageService.uploadFile(
          'escudos_equipos',
          equipoPayload.escudoUrl!
        );
        if (!imageRes.success || !imageRes.data) {
          throw new Error(imageRes.errorMessage || 'Error al subir la imagen');
        }
        equipoPayload.escudoUrl = imageRes.data;
      }

      // Ahora guardamos la solicitud en Firestore usando el servicio unificado
      const pathSegments = [
        'temporadas',
        temporadaId,
        'solicitudes',
        solicitudId,
      ];
      const res = await FirestoreService.setDocumentByPath<Partial<Solicitud>>(
        ...pathSegments,
        payload
      );
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al guardar la solicitud');
      }

      return { success: true, data: res.data };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err instanceof Error ? err.message : String(err),
      };
    }
  },

  /** Borrar una solicitud concreta */
  deleteSolicitud: async (
    temporadaId: string,
    solicitudId: string
  ): Promise<ResultService<null>> => {
    try {
      const res = await FirestoreService.deleteDocumentByPath(
        'temporadas',
        temporadaId,
        'solicitudes',
        solicitudId
      );
      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al eliminar la solicitud');
      }
      return { success: true, data: null };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },

  /** Obtener solicitudes con filtros */
  getSolicitudesWithFilters: async (
    temporadaId: string,
    andFilters: [string, WhereFilterOp, any][] = [],
    orFilters: [string, WhereFilterOp, any][] = []
  ): Promise<ResultService<Solicitud[]>> => {
    try {
      // Montamos el path completo como array
      const path = ['temporadas', temporadaId, 'solicitudes'];

      // Delegamos en FirestoreService
      const res = await FirestoreService.getCollectionByPath<Solicitud>(
        path,
        andFilters,
        orFilters
      );

      if (!res.success) {
        throw new Error(res.errorMessage || 'Error al obtener solicitudes');
      }

      return {
        success: true,
        data: res.data,
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || 'Error al obtener solicitudes',
      };
    }
  },

  rechazarSolicitudesPendientes: async (
    temporadaId: string,
    jugadorId: string
  ): Promise<ResultService<null>> => {
    try {
      const filtros: [string, WhereFilterOp, any][] = [
        ['tipo', '==', 'Unirse a Equipo'],
        ['estado', '==', 'pendiente'],
        ['jugadorObjetivo.id', '==', jugadorId],
      ];

      const res = await BaseSolicitudService.getSolicitudesWithFilters(
        temporadaId,
        filtros,
        []
      );

      if (!res.success || !res.data) {
        throw new Error(
          res.errorMessage ||
            'No se pudieron obtener las solicitudes pendientes'
        );
      }

      for (const solicitud of res.data) {
        const actualizada = {
          ...solicitud,
          estado: 'rechazada' as const,
          fechaRespuestaAdmin: new Date().toISOString(),
          respuestaAdmin: 'Solicitud rechazada automáticamente',
        };
        await BaseSolicitudService.setSolicitud(
          temporadaId,
          solicitud.id,
          actualizada
        );
      }

      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al rechazar solicitudes pendientes',
      };
    }
  },
};
