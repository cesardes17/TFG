type baseSolicitud = {
  id: string;
  estado: 'aceptada' | 'rechazada' | 'pendiente';
  tipo:
    | 'Crear Equipo'
    | 'Unirse a Equipo'
    | 'Salir de Equipo'
    | 'Disolver Equipo';
  solicitante: {
    id: string;
    nombreCompleto: string;
    correo: string;
  };
  fechaCreacion: string;
  admin?: {
    id: string;
    nombreCompleto: string;
    correo: string;
  };
  fechaRespuestaAdmin?: string;
  respuestaAdmin?: string;
};

export type solicitudCrearEquipo = baseSolicitud & {
  tipo: 'Crear Equipo';
  nombreEquipo: string;
  escudoUrl: string;
};

export type Solicitud = solicitudCrearEquipo;
