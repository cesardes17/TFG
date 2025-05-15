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
}

export default function SolicitudCard({
  solicitud,
  onAceptar,
  onRechazar,
}: SolicitudCardProps) {
  const { user } = useUser();
  const isAdmin =
    user?.role === 'organizador' || user?.role === 'coorganizador';
  const userActual = { id: user!.uid, esAdmin: isAdmin };
  switch (solicitud.tipo) {
    case 'Crear Equipo':
      return (
        <SolicitudCrearEquipoCard
          solicitud={solicitud as solicitudCrearEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
        />
      );
    case 'Unirse a Equipo':
      return (
        <SolicitudUnirseEquipoCard
          solicitud={solicitud as solicitudUnirseEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
        />
      );

    case 'Salir de Equipo':
      return (
        <SolicitudSalirEquipoCard
          solicitud={solicitud as solicitudSalirEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
        />
      );
    case 'Disolver Equipo':
      return (
        <SolicitudDisolverEquipoCard
          solicitud={solicitud as solicitudDisolverEquipo}
          usuarioActual={userActual}
          onAceptar={onAceptar}
          onRechazar={onRechazar}
        />
      );
    default:
      return null;
  }
}
