type baseSolicitud = {
  id: string;
  estado: 'aceptada' | 'rechazada' | 'pendiente';
  tipo:
    | 'Crear Equipo'
    | 'Unirse a Equipo'
    | 'Salir de Equipo'
    | 'Disolver Equipo';
  fechaCreacion: string;
  adminId?: string;
  fechaRespuestaAdmin?: string;
};

export type solicitudCrearEquipo = baseSolicitud & {
  tipo: 'Crear Equipo';
  nombreEquipo: string;
  escudoUrl: string;
};

export type Solicitud = solicitudCrearEquipo;
