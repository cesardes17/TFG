import { Inscripcion } from '../../../types/Inscripcion';
import { ResultService } from '../../../types/ResultService';
import { Solicitud, solicitudUnirseEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { getRandomUID } from '../../../utils/getRandomUID';
import { inscripcionesService } from '../../inscripcionesService';
import { BaseSolicitudService } from '../baseSolicitud';

export const aceptarUnirseEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudUnirseEquipo,
  usuario: User
): Promise<ResultService<Solicitud>> => {
  let solicitudModificada = false;
  const solicitudInicial = solicitud;
  try {
    const isAdmin =
      usuario.role === 'organizador' || usuario.role === 'coorganizador';
    const aprobadaAdmin = solicitud.admin ? true : false;
    const aprobadaJugador = solicitud.aprobadoJugadorObjetivo === true;
    if (isAdmin) {
      if (aprobadaJugador) {
        solicitud = {
          ...solicitud,
          estado: 'aceptada',
        };
      }
      solicitud = {
        ...solicitud,
        fechaRespuestaAdmin: new Date().toISOString(),
        admin: {
          id: usuario.uid,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
        },
      };
    } else {
      if (aprobadaAdmin) {
        solicitud = {
          ...solicitud,
          estado: 'aceptada',
        };
        solicitud = {
          ...solicitud,
          fechaRespuestaJugador: new Date().toISOString(),
          aprobadoJugadorObjetivo: true,
        };
      }
    }
    solicitudModificada = true;

    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud
    );
    if (!res.success) {
      throw new Error(res.errorMessage || 'Error al aceptar la solicitud');
    }

    if (solicitud.estado === 'aceptada') {
      const inscripcionData: Inscripcion = {
        id: getRandomUID(),
        equipoId: solicitud.equipoObjetivo.id,
        jugador: {
          id: solicitud.jugadorObjetivo.id,
          nombre: solicitud.jugadorObjetivo.nombre,
          apellidos: solicitud.jugadorObjetivo.apellidos,
          correo: solicitud.jugadorObjetivo.correo,
          photoURL: solicitud.jugadorObjetivo.photoURL,
          dorsal: solicitud.jugadorObjetivo.dorsal,
        },
      };
      const resInscripcion = await inscripcionesService.crearInscripcion(
        temporadaId,
        inscripcionData.id,
        inscripcionData
      );
      if (!resInscripcion.success) {
        throw new Error(
          resInscripcion.errorMessage || 'Error al crear la inscripcion'
        );
      }
    }

    return {
      success: true,
      data: solicitud,
    };
  } catch (error) {
    //TODO : en caso de error, devolver el estado anterior de la solicitud
    if (solicitudModificada) {
      await BaseSolicitudService.setSolicitud(
        temporadaId,
        solicitudInicial.id,
        solicitudInicial
      );
    }

    return {
      success: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : 'Error al aceptar la solicitud',
    };
  }
};
