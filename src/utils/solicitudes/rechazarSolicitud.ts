import { ToastType } from '../../components/common/Toast';
import {
  aceptarCrearEquipoSolicitud,
  rechazarCrearEquipoSolicitud,
} from '../../services/solicitudesService';
import { rechazarDisolverEquipoSolicitud } from '../../services/solicitudesService/disolveTeamSolicitud/rechazar';
import { rechazarUnirseEquipoSolicitud } from '../../services/solicitudesService/joinTeamSolicitud/rechazar';
import { rechazarSalirEquipoSolicitud } from '../../services/solicitudesService/leaveTeamSolicitud/rechazar';
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
  inputModal: string
): Promise<{ type: ToastType; message: string }> {
  switch (solicitud.tipo) {
    case 'Crear Equipo': {
      const rechazoData: solicitudCrearEquipo = {
        ...(solicitud as solicitudCrearEquipo),
        id: solicitud.id,
        estado: 'rechazada',
        respuestaAdmin: inputModal,
        fechaRespuestaAdmin: new Date(),
        admin: {
          id: usuarioActor!.uid,
          nombre: usuarioActor!.nombre,
          apellidos: usuarioActor!.apellidos,
          correo: usuarioActor!.correo,
        },
      };
      const res = await rechazarCrearEquipoSolicitud(temporadaId, rechazoData);

      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud rechazada'
          : 'Error al rechazar la solicitud',
      };
    }
    case 'Unirse a Equipo': {
      console.log('Unirse a Equipo - ');
      const res = await rechazarUnirseEquipoSolicitud(
        temporadaId,
        solicitud as solicitudUnirseEquipo,
        usuarioActor,
        inputModal
      );
      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud rechazada'
          : 'Error al rechazar la solicitud',
      };
    }
    case 'Salir de Equipo': {
      console.log('Unirse a Equipo - ');
      const res = await rechazarSalirEquipoSolicitud(
        temporadaId,
        solicitud as solicitudSalirEquipo,
        usuarioActor,
        inputModal
      );
      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud rechazada'
          : 'Error al rechazar la solicitud',
      };
    }
    case 'Disolver Equipo': {
      const res = await rechazarDisolverEquipoSolicitud(
        temporadaId,
        solicitud as solicitudDisolverEquipo,
        usuarioActor,
        inputModal
      );
      return {
        type: res.success ? 'success' : 'error',
        message: res.success
          ? 'Solicitud rechazada'
          : 'Error al rechazar la solicitud',
      };
    }
    default:
      return {
        type: 'error',
        message: 'Tipo de solicitud inexistente',
      };
  }
}
