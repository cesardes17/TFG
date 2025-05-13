// src/screens/NuevaSolicitudScreen.tsx
import { useUser } from '../../contexts/UserContext';
import { PlayerProfile } from '../../types/User';
import NuevaSolicitudForm from '../../components/forms/solicitud/NuevaSolicitudForm';

export default function NuevaSolicitudScreen() {
  const { user } = useUser();

  if (!user) return null;

  const opcionesPermitidas: ('createTeam' | 'leaveTeam' | 'dissolveTeam')[] =
    [];

  const tieneEquipo = (user as PlayerProfile)?.equipo;
  const esCapitan = user.role === 'capitan';
  const esJugador = user.role === 'jugador';
  if (!tieneEquipo && esJugador) opcionesPermitidas.push('createTeam');
  else if (esCapitan) opcionesPermitidas.push('dissolveTeam');
  else opcionesPermitidas.push('leaveTeam');

  return <NuevaSolicitudForm opcionesPermitidas={opcionesPermitidas} />;
}
