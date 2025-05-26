import { PlayerRegistration } from '../types/User';

export const jugadores: (PlayerRegistration & {
  contraseña: string;
})[] = [
  {
    nombre: 'Jugador 1',
    apellidos: 'Equipo 8',
    correo: 'jugador1@equipo8.com',
    contraseña: '123123',
    rol: 'jugador',
    altura: 184,
    peso: 78,
    dorsal: 11,
    posicion: 'Escolta',
    fotoUrl:
      '///Users/cesarjosedelgadosuarez/Library/Developer/CoreSimulator/Devices/8405DA64-5125-49E9-AF74-6A7C60E901EE/data/Containers/Data/Application/583B63F5-9704-4652-B438-504B5DB4B3D1/Library/Caches/ImageManipulator/3CD65870-61C5-4B7B-AE6D-A235439EF0C4.jpg',
    fotoPath: '',
    sancionado: false,
  },
  {
    nombre: 'Jugador 2',
    apellidos: 'Equipo 8',
    correo: 'jugador2@equipo8.com',
    contraseña: '123123',
    rol: 'jugador',
    altura: 188,
    peso: 82,
    dorsal: 22,
    posicion: 'Base',
    fotoUrl:
      '///Users/cesarjosedelgadosuarez/Library/Developer/CoreSimulator/Devices/8405DA64-5125-49E9-AF74-6A7C60E901EE/data/Containers/Data/Application/583B63F5-9704-4652-B438-504B5DB4B3D1/Library/Caches/ImageManipulator/5527E650-139A-449A-A7E6-454BEA97F33C.jpg',
    fotoPath: '',
    sancionado: false,
  },
  {
    nombre: 'Jugador 3',
    apellidos: 'Equipo 8',
    correo: 'jugador3@equipo8.com',
    contraseña: '123123',
    rol: 'jugador',
    altura: 190,
    peso: 85,
    dorsal: 33,
    posicion: 'Alero',
    fotoUrl:
      '///Users/cesarjosedelgadosuarez/Library/Developer/CoreSimulator/Devices/8405DA64-5125-49E9-AF74-6A7C60E901EE/data/Containers/Data/Application/583B63F5-9704-4652-B438-504B5DB4B3D1/Library/Caches/ImageManipulator/9FDEFA0D-E0B1-4822-9CBD-8EBE7302ACFE.jpg',
    fotoPath: '',
    sancionado: false,
  },
];
