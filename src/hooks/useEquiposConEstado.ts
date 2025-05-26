// src/hooks/useEquiposConEstado.ts
import { useEffect, useState, useCallback } from 'react';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { equipoService } from '../services/equipoService';
import { inscripcionesService } from '../services/inscripcionesService';

export interface EquipoEstado {
  id: string;
  nombre: string;
  escudoUrl: string;
  jugadores: number;
  cumple: boolean;
}

const MINIMO_JUGADORES = 8;

export function useEquiposConEstado() {
  const { temporada } = useTemporadaContext();
  const [equipos, setEquipos] = useState<EquipoEstado[]>([]);
  const [equiposIncompletos, setEquiposIncompletos] = useState<EquipoEstado[]>(
    []
  );
  const [equiposCompletos, setEquiposCompletos] = useState<EquipoEstado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEquipos = useCallback(async () => {
    if (!temporada) return;
    setLoading(true);
    setError(null);

    try {
      const resEquipos = await equipoService.getEquipos(temporada.id);
      if (!resEquipos.success || !resEquipos.data)
        throw new Error(resEquipos.errorMessage);

      const equiposBase = resEquipos.data;

      const conEstado = await Promise.all(
        equiposBase.map(async (equipo) => {
          const resInsc = await inscripcionesService.getInscripcionesByTeam(
            temporada.id,
            equipo.id
          );
          if (!resInsc.success || !resInsc.data)
            throw new Error(resInsc.errorMessage);

          const numJugadores = resInsc.data.length;
          const cumple = numJugadores >= MINIMO_JUGADORES;

          return {
            id: equipo.id,
            nombre: equipo.nombre,
            escudoUrl: equipo.escudoUrl,
            jugadores: numJugadores,
            cumple,
          };
        })
      );

      setEquipos(conEstado);
      setEquiposCompletos(conEstado.filter((e) => e.cumple));
      setEquiposIncompletos(conEstado.filter((e) => !e.cumple));
    } catch (e: any) {
      setError(e.message || 'Error al obtener los equipos');
    } finally {
      setLoading(false);
    }
  }, [temporada?.id]);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  return {
    equipos,
    equiposCompletos,
    equiposIncompletos,
    loading,
    error,
    refetch: cargarEquipos, // ✅ Aquí lo expones para usarlo externamente
  };
}
