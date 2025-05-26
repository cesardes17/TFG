import { ResultService } from '../../../types/ResultService';
import { solicitudDisolverEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { BaseSolicitudService } from '../baseSolicitud';
import { UserService } from '../../userService';
import { disolverEquipo } from '../../../utils/equipos/disolverEquipo';

export const aceptarDisolverEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudDisolverEquipo,
  usuario: User,
  onProgress: (text: string) => void
): Promise<ResultService<solicitudDisolverEquipo>> => {
  try {
    // Paso 1: Disolver el equipo completo
    await disolverEquipo(temporadaId, solicitud.equipo.id, onProgress);

    // Paso 2: Actualizar la solicitud
    onProgress('Actualizando solicitud...');
    const actualizada: solicitudDisolverEquipo = {
      ...solicitud,
      estado: 'aceptada',
      fechaRespuestaAdmin: new Date(),
      admin: {
        id: usuario.uid,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
      },
      vistoSolicitante: false,
    };

    const resSol = await BaseSolicitudService.setSolicitud(
      temporadaId,
      actualizada.id,
      actualizada,
      onProgress
    );
    if (!resSol.success) {
      throw new Error(resSol.errorMessage);
    }

    return {
      success: true,
      data: actualizada,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : 'Error al aceptar la solicitud de disolución',
    };
  }
};
