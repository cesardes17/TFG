import { ResultService } from '../../../types/ResultService';
import { solicitudSalirEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { BaseSolicitudService } from '../baseSolicitud';

export const rechazarSalirEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudSalirEquipo,
  usuario: User,
  motivo: string,
  onProgress: (text: string) => void
): Promise<ResultService<solicitudSalirEquipo>> => {
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
        vistoSolicitante: false,
      };
    } else {
      solicitud = {
        ...solicitud,
        estado: 'rechazada',
        fechaRespuestaCapitan: new Date(),
        motivoRespuestaCapitan: motivo,
        aprobadoCapitan: false,
        vistoSolicitante: false,
      };
    }
    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud,
      onProgress
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
