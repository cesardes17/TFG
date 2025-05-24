// src/hooks/useVerificarAnunciosNuevos.ts
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router'; // dispara al ganar foco
import { useUser } from '../contexts/UserContext';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { UserService } from '../services/userService';
import { anunciosService } from '../services/anunciosService';

export function useVerificarAnunciosNuevos(): number {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const [hayNuevos, setHayNuevos] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!temporada || !user) return;

      let montado = true;
      (async () => {
        // 1) Leer último acceso
        const visRes = await UserService.obtenerVisitaTablon(user.uid);
        const desde = visRes.success && visRes.data ? visRes.data : new Date(0);

        // 2) Preguntar si hay anuncios más recientes

        const nuevos = await anunciosService.hayAnunciosNuevos(
          temporada.id,
          desde
        );

        if (montado && nuevos.success && nuevos.data !== undefined) {
          setHayNuevos(nuevos.data);
        }
      })();

      return () => {
        montado = false;
      };
    }, [temporada?.id, user?.uid])
  );

  return hayNuevos;
}
