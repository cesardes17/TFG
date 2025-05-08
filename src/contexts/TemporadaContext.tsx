// src/contexts/TemporadaContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Temporada } from '../types/Temporada';
import { temporadaService } from '../services/temporadaService';

type TemporadaContextType = {
  temporada: Temporada | null;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  const fetchTemporada = async () => {
    setLoading(true);
    const result = await temporadaService.getTemporadaActual();
    if (result.success && result.data) {
      setTemporada(result.data);
    } else {
      console.warn(result.errorMessage || 'No hay temporada activa');
      setTemporada(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemporada();
  }, []);

  return (
    <TemporadaContext.Provider
      value={{
        temporada,
        loading,
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
