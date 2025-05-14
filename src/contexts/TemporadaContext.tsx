// src/contexts/TemporadaContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Temporada } from '../types/Temporada';
import { temporadaService } from '../services/temporadaService';

type TemporadaContextType = {
  temporada: Temporada | null;
  loadingTemporada: boolean;
  refetchTemporada: () => Promise<void>;
};

const TemporadaContext = createContext<TemporadaContextType | undefined>(
  undefined
);

export const TemporadaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [temporada, setTemporada] = useState<Temporada | null>(null);
  const [loadingTemporada, setloadingTemporada] = useState(true);

  const fetchTemporada = async () => {
    setloadingTemporada(true);
    const result = await temporadaService.getTemporadaActual();
    if (result.success && result.data) {
      setTemporada(result.data);
    } else {
      console.warn(result.errorMessage || 'No hay temporada activa');
      setTemporada(null);
    }
    setloadingTemporada(false);
  };

  useEffect(() => {
    fetchTemporada();
  }, []);

  return (
    <TemporadaContext.Provider
      value={{
        temporada,
        loadingTemporada,
        refetchTemporada: fetchTemporada,
      }}
    >
      {children}
    </TemporadaContext.Provider>
  );
};

export const useTemporadaContext = (): TemporadaContextType => {
  const context = useContext(TemporadaContext);
  if (!context) {
    throw new Error(
      'useTemporadaContext debe usarse dentro de TemporadaProvider'
    );
  }
  return context;
};
