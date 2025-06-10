// src/components/jornadas/BodyJornadas.tsx
import { View } from 'react-native';
import { useEffect, useMemo, useState, useCallback } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import StyledAlert from '../common/StyledAlert';
import CarruselJornadas, { JornadaSelectable } from './CarruselJornadas';
import MostrarPartidos from './MostrarPartidos';
import { Competicion } from '../../types/Competicion';
import { Jornada } from '../../types/Jornada';
import { useJornadas } from '../../hooks/useJornadas';

interface BodyJornadasProps {
  competicion: Competicion;
}

export default function BodyJornadas({ competicion }: BodyJornadasProps) {
  const { jornadas, loading, error } = useJornadas(competicion);

  // Derived list for the carousel
  const jornadasSelectable: JornadaSelectable[] = useMemo(
    () => jornadas.map(({ id, nombre }) => ({ id, label: nombre })),
    [jornadas]
  );

  // Compute default jornada when jornadas change
  const defaultJornada = useMemo<Jornada | null>(() => {
    if (jornadas.length === 0) return null;
    return jornadas.find((j) => j.estado === 'pendiente') ?? jornadas[0];
  }, [jornadas]);

  // Manage selected jornada state
  const [selectedJornada, setSelectedJornada] = useState<Jornada | null>(
    defaultJornada
  );

  // Reset selection when defaultJornada updates
  useEffect(() => {
    setSelectedJornada(defaultJornada);
  }, [defaultJornada]);

  // Handler to change selection
  const handleSelect = useCallback(
    (id: string) => {
      const jornada = jornadas.find((j) => j.id === id) ?? defaultJornada;
      setSelectedJornada(jornada);
    },
    [jornadas, defaultJornada]
  );

  useEffect(() => {
    setSelectedJornada(null);
  }, [competicion]);

  // Loading state
  if (loading) {
    return (
      <View>
        <LoadingIndicator text='Cargando jornadas...' />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View>
        <StyledAlert
          variant='error'
          message='Error al obtener las jornadas...'
        />
      </View>
    );
  }

  // No jornadas available
  if (!selectedJornada) {
    return (
      <View>
        <StyledAlert variant='info' message='No hay jornadas disponibles.' />
      </View>
    );
  }

  // Main render
  return (
    <View>
      <CarruselJornadas
        jornadas={jornadasSelectable}
        jornadaSeleccionada={selectedJornada.id}
        onSeleccionarJornada={handleSelect}
      />
      <MostrarPartidos jornada={selectedJornada} competicion={competicion} />
    </View>
  );
}
