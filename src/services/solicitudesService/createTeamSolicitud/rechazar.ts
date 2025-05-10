import { solicitudCrearEquipo } from '../../../types/Solicitud';

import { BaseSolicitudService } from '../baseSolicitud';

export const rechazarCrearEquipoSolicitud = async (
  temporadaId: string,
  data: solicitudCrearEquipo
) => {
  try {
    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      data.id,
      data
    );
    if (!res.success) {
      throw new Error(res.errorMessage || 'Error al crear la solicitud');
    }
    return res;
  } catch (error) {
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
