import { ResultService } from '../../../types/ResultService';
import { solicitudUnirseEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { BaseSolicitudService } from '../baseSolicitud';

export const rechazarUnirseEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudUnirseEquipo,
  usuario: User,
  motivo: string,
  onProgress: (text: string) => void
): Promise<ResultService<solicitudUnirseEquipo>> => {
  const isAdmin =
    usuario.rol === 'organizador' || usuario.rol === 'coorganizador';

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
        fechaRespuestaJugador: new Date(),
        motivoRespuestaJugador: motivo,
        aprobadoJugadorObjetivo: false,
      };
    }

    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud,
      onProgress
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
