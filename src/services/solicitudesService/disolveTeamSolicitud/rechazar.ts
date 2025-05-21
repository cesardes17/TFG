import { ResultService } from '../../../types/ResultService';
import { solicitudDisolverEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { BaseSolicitudService } from '../baseSolicitud';

export const rechazarDisolverEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudDisolverEquipo,
  usuario: User,
  motivo: string
): Promise<ResultService<solicitudDisolverEquipo>> => {
  try {
    solicitud = {
      ...solicitud,
      admin: {
        id: usuario.uid,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
      },
      estado: 'rechazada',
      fechaRespuestaAdmin: new Date(),
      respuestaAdmin: motivo,
    };
    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud
    );
    if (!res.success) {
      throw new Error(res.errorMessage);
    }

    return {
      success: true,
      data: solicitud,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
