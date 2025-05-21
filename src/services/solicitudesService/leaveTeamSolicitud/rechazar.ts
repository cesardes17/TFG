import { ResultService } from '../../../types/ResultService';
import { solicitudSalirEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { BaseSolicitudService } from '../baseSolicitud';

export const rechazarSalirEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudSalirEquipo,
  usuario: User,
  motivo: string
): Promise<ResultService<solicitudSalirEquipo>> => {
  const isAdmin =
    usuario.role === 'organizador' || usuario.role === 'coorganizador';
  try {
    if (isAdmin) {
      solicitud = {
        ...solicitud,
        estado: 'rechazada',
        fechaRespuestaAdmin: new Date(),
        respuestaAdmin: motivo,
        admin: {
          id: usuario.uid,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
        },
      };
    } else {
      solicitud = {
        ...solicitud,
        estado: 'rechazada',
        fechaRespuestaCapitan: new Date(),
        motivoRespuestaCapitan: motivo,
        aprobadoCapitan: false,
      };
    }
    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud
    );

    if (!res.success || !res.data) {
      throw new Error(res.errorMessage || 'Error al rechazar la solicitud');
    }

    return {
      success: true,
      data: solicitud,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : 'Error al rechazar la solicitud',
    };
  }
};
