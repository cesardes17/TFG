export type tipoSolicitud =
  | 'Crear Equipo'
  | 'Unirse a Equipo'
  | 'Salir de Equipo'
  | 'Disolver Equipo';

type baseSolicitud = {
  id: string;
  estado: 'aceptada' | 'rechazada' | 'pendiente';
  tipo: tipoSolicitud;

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
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    photoURL: string;
    dorsal: number;
  };
};
export type solicitudUnirseEquipo = baseSolicitud & {
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    photoURL: string;
  };
  jugadorObjetivo: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    photoURL: string;
    dorsal: number;
  };
  fechaRespuestaJugador?: string;
  motivoRespuestaJugador?: string;
  aprobadoJugadorObjetivo?: boolean;
  equipoObjetivo: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
};

export type solicitudSalirEquipo = baseSolicitud & {
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    photoURL: string;
  };
  equipoActual: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  capitanObjetivo: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
  };
  aprobadoCapitan?: boolean;
  fechaRespuestaCapitan?: string;
  motivoRespuestaCapitan?: string;
};
export type Solicitud = solicitudCrearEquipo | solicitudUnirseEquipo;
