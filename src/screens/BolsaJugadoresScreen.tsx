import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import PlayerList from '../components/bolsaJugadores/BolsaList';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { bolsaJugadoresService } from '../services/bolsaService';
import { BolsaJugador } from '../types/BolsaJugador';
import { solicitudUnirseEquipo } from '../types/Solicitud';
import { getRandomUID } from '../utils/getRandomUID';
import { useUser } from '../contexts/UserContext';
import { BaseSolicitudService } from '../services/solicitudesService';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { equipoService } from '../services/equipoService';
import { PlayerProfile } from '../types/User';
import LoadingIndicator from '../components/common/LoadingIndicator';

const BolsaJugadoresScreen = () => {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const usuarioActualId = user?.uid;
  const [isLoading, setIsLodaing] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [estadosSolicitudes, setEstadosSolicitudes] = useState<
    Record<string, 'ninguna' | 'pendiente'>
  >({});
  const [inscripciones, setInscripciones] = useState<BolsaJugador[]>([]);

  useEffect(() => {
    if (!temporada || !user) return;

    const fetchData = async () => {
      setIsLodaing(true);
      setLoadingText('Cargando jugadores...');
      try {
        const res = await bolsaJugadoresService.getJugadoresInscritos(
          temporada.id
        );
        if (!res.success || !res.data) {
          throw new Error(res.errorMessage || 'Error al obtener inscripciones');
        }
        setInscripciones(res.data);

        const resSol = await BaseSolicitudService.getSolicitudesWithFilters(
          temporada.id,
          [
            ['tipo', '==', 'Unirse a Equipo'],
            ['estado', '==', 'pendiente'],
            ['solicitante.id', '==', usuarioActualId],
          ],
          []
        );

        if (!resSol.success || !resSol.data) {
          throw new Error(
            resSol.errorMessage || 'Error al obtener solicitudes'
          );
        }

        const estados: Record<string, 'ninguna' | 'pendiente'> = {};
        resSol.data.forEach((sol) => {
          const solicitud = sol as solicitudUnirseEquipo;
          estados[solicitud.jugadorObjetivo.id] = 'pendiente';
        });
        setEstadosSolicitudes(estados);
      } catch (error) {
        console.error('Error al cargar inscripciones y solicitudes:', error);
      }
      setIsLodaing(false);
      setLoadingText('');
    };

    fetchData();
  }, [temporada, user]);

  if (!temporada || !user) {
    return null;
  }
  const isAdmin = user.rol === 'organizador' || user.rol === 'coorganizador';

  const handleEnviarSolicitud = useCallback(
    async (jugadorId: string) => {
      setLoadingText('Enviando solicitud...');
      setIsLodaing(true);
      try {
        if (!temporada) {
          throw new Error('No hay una temporada seleccionada');
        }

        const jugador = inscripciones.find((j) => j.jugador.id === jugadorId);

        if (!jugador) {
          throw new Error('Jugador no encontrado');
        }

        const perfilUsuario = user as PlayerProfile;
        if (!perfilUsuario.equipo) {
          throw new Error('El usuario no tiene equipo');
        }

        const equipo = await equipoService.getEquipo(
          temporada.id,
          perfilUsuario.equipo.id
        );

        if (!equipo.success || !equipo.data) {
          throw new Error(equipo.errorMessage || 'Equipo no encontrado');
        }

        if (!jugador.jugador) {
          throw new Error('Jugador incompleto');
        }

        const solicitud: solicitudUnirseEquipo = {
          id: getRandomUID(),
          tipo: 'Unirse a Equipo',
          estado: 'pendiente',
          fechaCreacion: new Date(),
          solicitante: {
            id: user!.uid,
            nombre: user!.nombre!,
            apellidos: user!.apellidos!,
            correo: user!.correo!,
            fotoUrl: perfilUsuario.fotoUrl,
          },
          jugadorObjetivo: jugador.jugador,
          equipoObjetivo: {
            id: equipo.data.id,
            escudoUrl: equipo.data.escudoUrl,
            nombre: equipo.data.nombre,
          },
        };

        const res = await BaseSolicitudService.setSolicitud(
          temporada.id,
          solicitud.id,
          solicitud,
          setLoadingText
        );

        if (!res.success) {
          throw new Error(res.errorMessage || 'Error al enviar solicitud');
        }

        showToast('Solicitud enviada', 'success');

        setEstadosSolicitudes((prev) => ({
          ...prev,
          [jugador.jugador.id]: 'pendiente',
        }));
      } catch (error) {
        showToast('No se pudo enviar la solicitud', 'error');
      } finally {
        setIsLodaing(false);
        setLoadingText('');
      }
    },
    [temporada, user, inscripciones]
  );

  if (isLoading) {
    return <LoadingIndicator text={loadingText} />;
  }

  return (
    <PlayerList
      jugadores={inscripciones}
      usuarioActualId={usuarioActualId}
      estadosSolicitudes={estadosSolicitudes}
      onEnviarSolicitud={handleEnviarSolicitud}
      isAdmin={isAdmin}
    />
  );
};

export default BolsaJugadoresScreen;
