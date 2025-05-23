export type Inscripcion = {
  id: string;
  equipoId: string;
  jugador: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    fotoUrl: string;
    dorsal: number;
  };
  fechaInscripcion: Date;
};
