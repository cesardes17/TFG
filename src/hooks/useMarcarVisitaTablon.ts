// src/hooks/useMarcarVisitaTablon.ts

import { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { UserService } from '../services/userService';

export function useMarcarVisitaTablon() {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();

  useEffect(() => {
    if (!temporada || !user) return;

    const marcarVisita = async () => {
      const res = await UserService.marcarVisitaTablon(user.uid);
      if (!res.success) {
        console.error('Error al marcar visita al tablon:', res.errorMessage);
      }
    };
    marcarVisita();
  }, [temporada?.id, user?.uid]);
}
