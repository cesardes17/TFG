export type tipoSolicitud =
  | 'Crear Equipo'
  | 'Unirse a Equipo'
  | 'Salir de Equipo'
  | 'Disolver Equipo';

export type estadoSolicitud = 'aceptada' | 'rechazada' | 'pendiente';

type baseSolicitud = {
  id: string;
  estado: estadoSolicitud;
  tipo: tipoSolicitud;

  fechaCreacion: Date;
  admin?: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
  };
  fechaRespuestaAdmin?: Date;
  respuestaAdmin?: string;
  vistoSolicitante?: boolean; //variable para indicar si hay solicitudes pendientes para un solicitante
  vistoAfectado?: boolean; //variable para indicar si hay solicitudes pendientes para un tercer participante que debe aceptar la solicitud
};

export type solicitudCrearEquipo = baseSolicitud & {
  nombreEquipo: string;
  escudoUrl: string;
  escurdoPath: string;
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    fotoUrl: string;
    dorsal: number;
  };
};
export type solicitudUnirseEquipo = baseSolicitud & {
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    fotoUrl: string;
  };
  jugadorObjetivo: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    fotoUrl: string;
    dorsal: number;
  };
  fechaRespuestaJugador?: Date;
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
    fotoUrl: string;
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
    fotoUrl: string;
  };
  aprobadoCapitan?: boolean;
  fechaRespuestaCapitan?: Date;
  motivoRespuestaCapitan?: string;
  motivoSalida: string;
};

export type solicitudDisolverEquipo = baseSolicitud & {
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    fotoUrl: string;
  };
  equipo: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  motivoDisolucion: string;
};

export type Solicitud =
  | solicitudCrearEquipo
  | solicitudUnirseEquipo
  | solicitudSalirEquipo
  | solicitudDisolverEquipo;
