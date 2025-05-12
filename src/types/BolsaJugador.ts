export type BolsaJugador = {
  id: string;
  createdAt: string;

  jugador: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    dorsal: number;
    posicion: string;
    altura: number;
    peso: number;
    photoURL: string;
  };
};
