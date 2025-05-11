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
    nombre: string;
    apellidos: string;
    correo: string;
    photoURL: string;
    dorsal: number;
  };
  fechaCreacion: string;
  admin?: {
    id: string;
    nombre: string;
    apellidos: string;
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
