// src/hooks/useJugadorInfo.ts
import { useEffect, useState } from 'react';

import { PlayerUser } from '../types/User';
import { UserService } from '../services/userService';

export function useJugadorInfo(jugadorId: string) {
  const [jugadorInfo, setJugadorInfo] = useState<PlayerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchJugador = async () => {
      setLoading(true);
      try {
        const res = await UserService.getUserProfile(jugadorId);
        if (!res.success) {
          throw new Error(res.errorMessage);
        }
        setJugadorInfo(res.data! as PlayerUser);
      } catch (error) {
        setErrorMsg(
          error instanceof Error ? error.message : 'Error al obtener jugador'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchJugador();
  }, [jugadorId]);

  return { jugadorInfo, loading, errorMsg };
}
