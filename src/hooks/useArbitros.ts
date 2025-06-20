// src/hooks/useArbitros.ts
import { useEffect, useState } from 'react';

import { User } from '../types/User';
import { ArbitroAsignado } from '../types/Partido';
import { UserService } from '../services/userService';

export default function useArbitros() {
  const [arbitros, setArbitros] = useState<ArbitroAsignado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArbitros = async () => {
      setLoading(true);
      const res = await UserService.getArbitros();
      if (!res.success || !res.data) {
        console.error('Error al obtener los arbitros:', res.errorMessage);
        setLoading(false);
        return;
      }
      const arbitros = res.data;
      console.log('usuarios', arbitros);
      const arbitrosAsignados: ArbitroAsignado[] = arbitros.map((usuario) => ({
        id: usuario.uid, // ← usa uid como id
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
      }));
      setArbitros(arbitrosAsignados);
      setLoading(false);
    };

    fetchArbitros();
  }, []);

  return { arbitros, loading };
}
