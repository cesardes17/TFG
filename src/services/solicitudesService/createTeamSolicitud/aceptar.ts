import { Equipo } from '../../../types/Equipo';
import { Inscripcion } from '../../../types/Inscripcion';
import { solicitudCrearEquipo } from '../../../types/Solicitud';
import { PlayerUser } from '../../../types/User';
import { getRandomUID } from '../../../utils/getRandomUID';
import { equipoService } from '../../equipoService';
import { inscripcionesService } from '../../inscripcionesService';
import { UserService } from '../../userService';
import { BaseSolicitudService } from '../baseSolicitud';

export const aceptarCrearEquipoSolicitud = async (
  temporadaId: string,
  data: solicitudCrearEquipo
) => {
  try {
    // Paso 1: Aceptar la solicitud
    const resSol = await BaseSolicitudService.setSolicitud(
      temporadaId,
      data.id,
      data
    );
    if (!resSol.success) {
      throw new Error(resSol.errorMessage || 'Error al crear la solicitud');
    }
    //Paso 2: Crear el equipo
    const equipoData: Equipo = {
      id: getRandomUID(),
      capitan: data.solicitante,
      nombre: data.nombreEquipo,
      escudoUrl: data.escudoUrl,
      fechaCreacion: new Date().toString(),
    };

    const resEquipo = await equipoService.crearEquipo(
      temporadaId,
      equipoData.id,
      equipoData
    );
    if (!resEquipo.success) {
      throw new Error(resEquipo.errorMessage || 'Error al crear el equipo');
    }

    //Paso 3: Inscribir jugador a equipo
    const inscripcionData: Inscripcion = {
      id: getRandomUID(),
      equipoId: resEquipo.data!,
      jugador: data.solicitante,
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
    //Paso 4: Actualizar rol de usuario a capitán
    const userData: Partial<PlayerUser> = {
      role: 'capitan',
      equipo: {
        id: resEquipo.data!,
        nombre: equipoData.nombre,
        escudoUrl: equipoData.escudoUrl,
      },
    };
    const resUser = await UserService.UpdatePlayerProfile(
      data.solicitante.id,
      userData
    );

    if (!resUser.success) {
      throw new Error(resUser.errorMessage || 'Error al actualizar el usuario');
    }
    const resRechazar =
      await BaseSolicitudService.rechazarSolicitudesPendientes(
        temporadaId,
        data.solicitante.id
      );
    if (!resRechazar.success) {
      throw new Error(
        resRechazar.errorMessage ||
          'Error al rechazar las solicitudes pendientes'
      );
    }
    return {
      success: true,
      data: resSol.data,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
