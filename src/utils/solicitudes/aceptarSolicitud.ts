import { ToastType } from '../../components/common/Toast';
import { aceptarCrearEquipoSolicitud } from '../../services/solicitudesService';
import { aceptarDisolverEquipoSolicitud } from '../../services/solicitudesService/disolveTeamSolicitud/aceptar';
import { aceptarUnirseEquipoSolicitud } from '../../services/solicitudesService/joinTeamSolicitud/aceptar';
import { aceptarSalirEquipoSolicitud } from '../../services/solicitudesService/leaveTeamSolicitud/aceptar';
import {
  Solicitud,
  solicitudCrearEquipo,
  solicitudDisolverEquipo,
  solicitudSalirEquipo,
  solicitudUnirseEquipo,
} from '../../types/Solicitud';
import { User } from '../../types/User';

export default async function (
  temporadaId: string,
  solicitud: Solicitud,
  usuarioActor: User,
  inputModal: string,
  onProgress: (text: string) => void
): Promise<{ type: ToastType; message: string }> {
  switch (solicitud.tipo) {
    case 'Crear Equipo': {
      console.log('Aceptar Crear Equipo');
      const aceptacionData: solicitudCrearEquipo = {
        ...(solicitud as solicitudCrearEquipo),
        id: solicitud.id,
        estado: 'aceptada',
        fechaRespuestaAdmin: new Date(),
        admin: {
          id: usuarioActor!.uid,
          nombre: usuarioActor!.nombre,
          apellidos: usuarioActor!.apellidos,
          correo: usuarioActor!.correo,
        },
      };
      const res = await aceptarCrearEquipoSolicitud(
        temporadaId,
        aceptacionData,
        onProgress
      );
      if (!res.success) {
        console.error(res.errorMessage);
      }
      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud aceptada'
          : 'Error al aceptar la solicitud',
      };
    }
    case 'Unirse a Equipo': {
      console.log('Unirse a Equipo - ');
      let solicitudUE = solicitud as solicitudUnirseEquipo;
      if (usuarioActor.rol === 'jugador') {
        solicitudUE.jugadorObjetivo.dorsal = parseInt(inputModal);
      }

      const res = await aceptarUnirseEquipoSolicitud(
        temporadaId,
        solicitud as solicitudUnirseEquipo,
        usuarioActor,
        onProgress
      );
      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud aceptada'
          : 'Error al aceptar la solicitud',
      };
    }
    case 'Salir de Equipo': {
      const res = await aceptarSalirEquipoSolicitud(
        temporadaId,
        solicitud as solicitudSalirEquipo,
        usuarioActor,
        onProgress
      );
      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud aceptada'
          : 'Error al aceptar la solicitud',
      };
    }
    case 'Disolver Equipo': {
      console.log('Disolver Equipo');
      const res = await aceptarDisolverEquipoSolicitud(
        temporadaId,
        solicitud as solicitudDisolverEquipo,
        usuarioActor,
        onProgress
      );
      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud aceptada'
          : 'Error al aceptar la solicitud',
      };
    }
    default:
      return {
        type: 'error',
        message: 'Tipo de solicitud inexistente',
      };
  }
}
