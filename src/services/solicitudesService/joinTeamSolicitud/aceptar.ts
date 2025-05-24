import { Inscripcion } from '../../../types/Inscripcion';
import { ResultService } from '../../../types/ResultService';
import { Solicitud, solicitudUnirseEquipo } from '../../../types/Solicitud';
import { PlayerProfile, User } from '../../../types/User';
import { getRandomUID } from '../../../utils/getRandomUID';
import { bolsaJugadoresService } from '../../bolsaService';
import { inscripcionesService } from '../../inscripcionesService';
import { UserService } from '../../userService';
import { BaseSolicitudService } from '../baseSolicitud';

export const aceptarUnirseEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudUnirseEquipo,
  usuario: User,
  onProgress: (text: string) => void
): Promise<ResultService<Solicitud>> => {
  let solicitudModificada = false;
  const solicitudInicial = solicitud;
  try {
    const isAdmin =
      usuario.rol === 'organizador' || usuario.rol === 'coorganizador';
    const aprobadaAdmin = solicitud.admin ? true : false;
    const aprobadaJugador = solicitud.aprobadoJugadorObjetivo === true;
    if (isAdmin) {
      if (aprobadaJugador) {
        solicitud = {
          ...solicitud,
          estado: 'aceptada',
          vistoSolicitante: false,
          vistoAfectado: false,
        };
      }
      solicitud = {
        ...solicitud,
        fechaRespuestaAdmin: new Date(),
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
          vistoSolicitante: false,
          vistoAfectado: true,
        };
      }
      solicitud = {
        ...solicitud,
        fechaRespuestaJugador: new Date(),
        aprobadoJugadorObjetivo: true,
      };
    }
    solicitudModificada = true;

    const res = await BaseSolicitudService.setSolicitud(
      temporadaId,
      solicitud.id,
      solicitud,
      onProgress
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
          fotoUrl: solicitud.jugadorObjetivo.fotoUrl,
          dorsal: solicitud.jugadorObjetivo.dorsal,
        },
        fechaInscripcion: new Date(),
      };

      onProgress('Creando inscripcion...');
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
      //Eliminar jugador de la bolsa de jugadores
      onProgress('Eliminando jugador de la bolsa...');
      const resBolsa = await bolsaJugadoresService.deleteJugadorInscrito(
        temporadaId,
        solicitud.jugadorObjetivo.id
      );
      if (!resBolsa.success) {
        throw new Error(
          resBolsa.errorMessage || 'Error al eliminar el jugador de la bolsa'
        );
      }
      //actualizar la informacion del jugador
      const jugadorActualizado: Partial<PlayerProfile> = {
        equipo: {
          id: solicitud.equipoObjetivo.id,
          nombre: solicitud.equipoObjetivo.nombre,
          escudoUrl: solicitud.equipoObjetivo.escudoUrl,
        },
      };
      onProgress('Actualizando jugador...');
      const resJugador = await UserService.UpdatePlayerProfile(
        solicitud.jugadorObjetivo.id,
        jugadorActualizado
      );
      if (!resJugador.success) {
        throw new Error(
          resJugador.errorMessage || 'Error al actualizar el jugador'
        );
      }

      //rechazamos la solicitudes pendientes del jugador (Unirse a equipo)
      const resRechazar =
        await BaseSolicitudService.rechazarSolicitudesPendientes(
          temporadaId,
          solicitud.jugadorObjetivo.id,
          onProgress
        );

      if (!resRechazar.success) {
        throw new Error(
          resRechazar.errorMessage ||
            'Error al rechazar las solicitudes pendientes'
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
        solicitudInicial,
        onProgress
      );
    }
    console.log(error);
    return {
      success: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : 'Error al aceptar la solicitud',
    };
  }
};
