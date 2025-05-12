type tipoSolicitud =
  | 'Crear Equipo'
  | 'Unirse a Equipo'
  | 'Salir de Equipo'
  | 'Disolver Equipo';

type baseSolicitud = {
  id: string;
  estado: 'aceptada' | 'rechazada' | 'pendiente';
  tipo: tipoSolicitud;
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    photoURL?: string;
    dorsal?: number;
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
  nombreEquipo: string;
  escudoUrl: string;
};
export type solicitudUnirseEquipo = baseSolicitud & {
  jugadorObjetivo: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    photoURL: string;
    dorsal: number;
  };
  fechaRespuestaJugador?: string;
};
export type Solicitud = solicitudCrearEquipo | solicitudUnirseEquipo;
