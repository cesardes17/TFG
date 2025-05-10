export type Equipo = {
  id: string;
  nombre: string;
  escudoUrl: string;
  capitan: {
    id: string;
    nombre: string; // más claro si se separa nombre/apellido
    apellidos: string;
    correo: string;
  };
  fechaCreacion: string; // ISO string (buena práctica)
};
