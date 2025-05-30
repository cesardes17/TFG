import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router'; // o de '@react-navigation/native' si usas React Navigation directamente
import { Partido } from '../types/Partido';
import { partidoService } from '../services/partidoService';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { TipoCompeticion } from '../types/Competicion';

export default function usePartido(
  partidoId: string,
  tipoCompeticion: TipoCompeticion
) {
  const [partido, setPartido] = useState<Partido | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { temporada } = useTemporadaContext();

  const fetchPartido = useCallback(async () => {
    if (!temporada) return;
    setIsLoading(true);
    setError(null);
    const res = await partidoService.getPartido(
      temporada.id,
      tipoCompeticion,
      partidoId
    );

    if (res.success && res.data) {
      setPartido(res.data);
    } else {
      setError(res.errorMessage || 'Error al cargar el partido');
    }
    setIsLoading(false);
  }, [temporada, partidoId, tipoCompeticion]);

  // Refresca la información cada vez que la pantalla recupera el foco
  useFocusEffect(
    useCallback(() => {
      fetchPartido();
    }, [fetchPartido])
  );

  return { partido, isLoading, error };
}
