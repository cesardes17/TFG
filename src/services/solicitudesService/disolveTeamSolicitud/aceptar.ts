import { ResultService } from '../../../types/ResultService';
import { solicitudDisolverEquipo } from '../../../types/Solicitud';
import { User } from '../../../types/User';
import { FirestoreService } from '../../core/firestoreService';
import { equipoService } from '../../equipoService';
import { inscripcionesService } from '../../inscripcionesService';
import { UserService } from '../../userService';
import { BaseSolicitudService } from '../baseSolicitud';

export const aceptarDisolverEquipoSolicitud = async (
  temporadaId: string,
  solicitud: solicitudDisolverEquipo,
  usuario: User,
  onProgress: (text: string) => void
): Promise<ResultService<solicitudDisolverEquipo>> => {
  try {
    //PASO 1: OBTENEMOS INSCRIPCIONES DEL EQUIPO
    const res = await inscripcionesService.getInscripcionesByTeam(
      temporadaId,
      solicitud.equipo.id
    );
    if (!res.success || !res.data || res.data.length === 0) {
      throw new Error(res.errorMessage);
    }
    const inscripciones = res.data;
    console.log('Inscripciones: ', inscripciones);
    //PASO 2: PARA CADA INSCRIPCION, LA ELIMINAMOS, Y ACTUALIZAMOS EL PERFIL DEL JUGADOR
    onProgress('Eliminando inscripciones...');
    inscripciones.forEach(async (inscripcion) => {
      //PASO 2.1: ELIMINAMOS LA INSCRIPCION
      await inscripcionesService.deleteInscripcionById(
        temporadaId,
        inscripcion.id
      );
      //PASO 2.2: QUITAMOS EL EQUIPO DEL PERFIL DEL JUGADOR
      const campo = {
        equipo: FirestoreService.getDeleteField(),
      };

      const jugador = await UserService.UpdatePlayerProfile(
        inscripcion.jugador.id,
        campo
      );
      if (!jugador.success || !jugador.data) {
        throw new Error(jugador.errorMessage);
      }
    });

    //PASO 3: ACTUALIZAMOS LA SOLICITUD
    onProgress('Actualizando solicitud...');
    solicitud = {
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
      solicitud.id,
      solicitud,
      onProgress
    );
    if (!resSol.success) {
      throw new Error(resSol.errorMessage);
    }

    //PASO 4: ACTUALIZAMOS EL rol DEL SOLICITANTE
    onProgress('Actualizando información del solicitante...');
    const rolRes = await UserService.UpdatePlayerProfile(
      solicitud.solicitante.id,
      {
        rol: 'jugador',
      }
    );
    if (!rolRes.success) {
      throw new Error(rolRes.errorMessage);
    }

    //PASO 5: Eliminamos el equipo
    onProgress('Eliminando equipo...');
    const resEquipo = await equipoService.deleteEquipo(
      temporadaId,
      solicitud.equipo.id
    );
    if (!resEquipo.success) {
      throw new Error(resEquipo.errorMessage);
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
