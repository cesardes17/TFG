import { ResultService } from '../../../types/ResultService';
import { solicitudSalirEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { FirestoreService } from '../../core/firestoreService';
import { inscripcionesService } from '../../inscripcionesService';
import { UserService } from '../../userService';
import { BaseSolicitudService } from '../baseSolicitud';

export const aceptarSalirEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudSalirEquipo,
  usuario: User
): Promise<ResultService<solicitudSalirEquipo>> => {
  const esAdmin =
    usuario.role === 'organizador' || usuario.role === 'coorganizador';
  const aprobadaAdmin = !!solicitud.admin;
  const aprobadoCapitan = solicitud.aprobadoCapitan === true;

  try {
    // Actualiza el estado de la solicitud según el rol
    if (esAdmin) {
      if (aprobadoCapitan) {
        solicitud.estado = 'aceptada';
      }
      solicitud.fechaRespuestaAdmin = new Date().toISOString();
      solicitud.admin = {
        id: usuario.uid,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
      };
    } else {
      if (aprobadaAdmin) {
        solicitud.estado = 'aceptada';
      }
      solicitud.fechaRespuestaCapitan = new Date().toISOString();
      solicitud.aprobadoCapitan = true;
    }

    // Guardar cambios en la solicitud
    const resSolicitud = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud
    );
    if (!resSolicitud.success || !resSolicitud.data) {
      throw new Error(
        resSolicitud.errorMessage || 'Error al aceptar la solicitud'
      );
    }

    // Si fue aceptada, ejecutar efectos secundarios
    if (solicitud.estado === 'aceptada') {
      const resInscripcion = await inscripcionesService.deleteInscripcion(
        temporadaId,
        solicitud.solicitante.id
      );
      if (!resInscripcion.success || !resInscripcion.data) {
        throw new Error(
          resInscripcion.errorMessage ||
            'Error al eliminar la inscripción del jugador'
        );
      }

      const campo = {
        equipo: FirestoreService.getDeleteField(),
      };

      const jugador = await UserService.UpdatePlayerProfile(
        solicitud.solicitante.id,
        campo
      );
      if (!jugador.success) {
        throw new Error(
          jugador.errorMessage ||
            'Error al actualizar la información del jugador'
        );
      }
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
          : 'Error al aceptar la solicitud',
    };
  }
};
