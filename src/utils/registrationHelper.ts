// /src/utils/registrationHelper.ts
import { AuthService } from '../services/core/authService';
import { StorageService } from '../services/core/storageService';
import { UserService } from '../services/userService';
import type { UserRegistration } from '../types/User';
import { getRandomUID } from './getRandomUID';

export default async function registrationHelper(
  user: UserRegistration,
  password: string
) {
  try {
    // 1) Registrar en Auth
    const { success, data, errorMessage } = await AuthService.register(
      user.correo,
      password
    );
    if (!success || !data) {
      throw new Error(errorMessage || 'Error al registrar usuario');
    }
    const uid = data.uid;

    // 2) Si es jugador o capitán, sube la foto
    const isJugador = user.role === 'jugador' || user.role === 'capitan';
    if (isJugador && user.photoURL) {
      // extrae extensión del archivo local
      const extMatch = /\.(jpg|jpeg|png|gif)$/i.exec(user.photoURL as string);
      const extension = extMatch ? extMatch[1] : 'jpg';

      // genera UUID
      const fileName = `${getRandomUID()}.${extension}`;
      // path completo en Storage
      const remotePath = `fotos_jugadores/${fileName}`;

      // sube y recoge la URL
      const storageRes = await StorageService.uploadFile(
        remotePath,
        user.photoURL
      );
      if (!storageRes.success || !storageRes.data) {
        throw new Error(storageRes.errorMessage || 'Error al subir la imagen');
      }

      user.photoURL = storageRes.data; // ahora es la URL remota
    }

    // 3) Crear documento de usuario en Firestore
    const {
      success: userSuccess,
      data: userData,
      errorMessage: userMsg,
    } = await UserService.createUser(uid, user);
    if (!userSuccess || !userData) {
      throw new Error(userMsg || 'Error al crear usuario en Firestore');
    }
    await AuthService.login(user.correo, password);

    return { success: true, data: userData, errorMessage: null };
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, errorMessage: error.message };
  }
}
