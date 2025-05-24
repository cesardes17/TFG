import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type Anuncio = {
  id: string;
  titulo: string;
  contenido: string;
  fechaPublicacion: Date;
  autor: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
  };
  imagenUrl?: string;
  imagenPath?: string;
};
