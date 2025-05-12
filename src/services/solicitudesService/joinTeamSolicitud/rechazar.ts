import { ResultService } from '../../../types/ResultService';
import { solicitudUnirseEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { BaseSolicitudService } from '../baseSolicitud';

export const rechazarUnirseEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudUnirseEquipo,
  usuario: User,
  motivo: string
): Promise<ResultService<solicitudUnirseEquipo>> => {
  const isAdmin =
    usuario.role === 'organizador' || usuario.role === 'coorganizador';

  try {
    if (isAdmin) {
      solicitud = {
        ...solicitud,
        estado: 'rechazada',
        fechaRespuestaAdmin: new Date().toISOString(),
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
        fechaRespuestaJugador: new Date().toISOString(),
        motivoRespuestaJugador: motivo,
        aprobadoJugadorObjetivo: false,
      };
    }

    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud
    );
    if (!res.success) {
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
