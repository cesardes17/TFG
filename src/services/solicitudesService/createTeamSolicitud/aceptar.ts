import { Equipo } from '../../../types/Equipo';
import { solicitudCrearEquipo } from '../../../types/Solicitud';
import { equipoService } from '../../equipoService';
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
      id: data.id,
      capitan: data.solicitante,
      nombre: data.nombreEquipo,
      escudoUrl: data.escudoUrl,
      fechaCreacion: new Date().toString(),
    };

    const resEquipo = await equipoService.crearEquipo(
      temporadaId,
      data.id,
      equipoData
    );
  } catch (error) {
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
