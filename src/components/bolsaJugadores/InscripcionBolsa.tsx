import { useEffect, useState } from 'react';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useUser } from '../../contexts/UserContext';
import StyledAlert from '../common/StyledAlert';
import { bolsaJugadoresService } from '../../services/bolsaService';
import StyledButton from '../common/StyledButton';
import { BolsaJugador } from '../../types/BolsaJugador';
import { getRandomUID } from '../../utils/getRandomUID';
import { PlayerUser } from '../../types/User';

interface InscripcionBolsaProps {
  screenLoading: (isLoading: boolean) => void;
}

export default function InscripcionBolsa({
  screenLoading,
}: InscripcionBolsaProps) {
  const { temporada, loadingTemporada } = useTemporadaContext();
  const { user, loadingUser, refetchUser } = useUser();
  const [estaInscrito, setEstaInscrito] = useState(false);

  useEffect(() => {
    if (loadingUser || loadingTemporada || !temporada || !user) return;

    const fecthBolsaData = async () => {
      const res = await bolsaJugadoresService.getJugadorInscrito(
        temporada.id,
        user.uid
      );
      if (res.success) {
        setEstaInscrito(res.data ? true : false);
        refetchUser();
      }
    };
    fecthBolsaData();
  }, [loadingTemporada, loadingUser, temporada]);

  if (!temporada || !user) {
    return;
  }
  const jugador = user as PlayerUser;

  const inscribirse = async () => {
    screenLoading(true);
    const payload: BolsaJugador = {
      id: getRandomUID(),
      createdAt: new Date().toDateString(),
      jugador: {
        id: jugador.uid,
        nombre: jugador.nombre,
        apellidos: jugador.apellidos,
        correo: jugador.correo,
        dorsal: jugador.dorsal,
        posicion: jugador.posicion,
        altura: jugador.altura,
        peso: jugador.peso,
        photoURL: jugador.photoURL,
      },
    };
    const res = await bolsaJugadoresService.inscribirJugador(
      temporada.id,
      payload
    );

    if (res.success) {
      setEstaInscrito(true);
    }
    screenLoading(false);
  };
  const desinscribirse = async () => {
    screenLoading(true);
    const res = await bolsaJugadoresService.deleteJugadorInscrito(
      temporada.id,
      jugador.uid
    );
    if (res.success) {
      setEstaInscrito(false);
    }
    screenLoading(false);
  };

  if (loadingTemporada) {
    screenLoading(true);
    return;
  }
  if (!temporada) {
    return <StyledAlert variant='error' message='No hay Temporada Activo' />;
  }

  return (
    <StyledButton
      title={
        estaInscrito ? 'Desinscribirse de la bolsa' : 'Inscribirse en la bolsa'
      }
      variant={estaInscrito ? 'error-outline' : 'outline'}
      onPress={() => {
        estaInscrito ? desinscribirse() : inscribirse();
      }}
    />
  );
}
