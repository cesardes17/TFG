import { useUser } from '../../contexts/UserContext';
import {
  Solicitud,
  solicitudCrearEquipo,
  solicitudDisolverEquipo,
  solicitudSalirEquipo,
  solicitudUnirseEquipo,
} from '../../types/Solicitud';
import SolicitudCrearEquipoCard from './SolicitudCrearEquipoCard';
import SolicitudDisolverEquipoCard from './SolicitudDisolverEquipo';
import SolicitudSalirEquipoCard from './SolicitudSalirEquipoCard';
import SolicitudUnirseEquipoCard from './SolicitudUnirseEquipoCard';
interface SolicitudCardProps {
  solicitud: Solicitud;
  onAceptar: (solicitud: Solicitud) => void;
  onRechazar: (solicitud: Solicitud) => void;
  marcarLeidoSolicitante: (solicitud: Solicitud) => void;
}

export default function SolicitudCard({
  solicitud,
  onAceptar,
  onRechazar,
  marcarLeidoSolicitante,
}: SolicitudCardProps) {
  const { user } = useUser();
  const isAdmin = user?.rol === 'organizador' || user?.rol === 'coorganizador';
  const userActual = { id: user!.uid, esAdmin: isAdmin };
  switch (solicitud.tipo) {
    case 'Crear Equipo':
      return (
        <SolicitudCrearEquipoCard
          solicitud={solicitud as solicitudCrearEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
          marcarLeidoSolicitante={marcarLeidoSolicitante}
        />
      );
    case 'Unirse a Equipo':
      return (
        <SolicitudUnirseEquipoCard
          solicitud={solicitud as solicitudUnirseEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
          marcarLeidoSolicitante={marcarLeidoSolicitante}
        />
      );

    case 'Salir de Equipo':
      return (
        <SolicitudSalirEquipoCard
          solicitud={solicitud as solicitudSalirEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
          marcarLeidoSolicitante={marcarLeidoSolicitante}
        />
      );
    case 'Disolver Equipo':
      return (
        <SolicitudDisolverEquipoCard
          solicitud={solicitud as solicitudDisolverEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
          marcarLeidoSolicitante={marcarLeidoSolicitante}
        />
      );
    default:
      return null;
  }
}
