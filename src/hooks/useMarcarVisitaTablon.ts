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
    UserService.marcarVisitaTablon(user.uid);
  }, [temporada?.id, user?.uid]);
}
