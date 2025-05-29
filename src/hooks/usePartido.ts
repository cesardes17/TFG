import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!temporada) return;
    const fetchPartido = async () => {
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
    };

    fetchPartido(); // <- no se te olvide ejecutar la función
  }, [temporada, partidoId]); // <- incluye partidoId en deps

  return { partido, isLoading, error };
}
