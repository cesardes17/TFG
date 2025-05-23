export type BolsaJugador = {
  id: string;
  fechaInscripcion: Date;

  jugador: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    dorsal: number;
    posicion: string;
    altura: number;
    peso: number;
    fotoUrl: string;
  };
};
