// /src/utils/registrationHelper.ts:
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { UserRegistration } from '../types/User';

export default async function registrationHelper(
  user: UserRegistration,
  password: string
) {
  try {
    const { success, data, errorMessage } = await AuthService.register(
      user.correo,
      password
    );
    if (!success || !data) {
      throw new Error(errorMessage || 'Error al registrar usuario');
    }

    const {
      success: userSucces,
      data: userData,
      errorMessage: userMessage,
    } = await UserService.createUser(data.uid, user);
    if (!userSucces || !userData) {
      throw new Error(userMessage || 'Error al crear usuario');
    }
    return { success: true, data: userData, errorMessage: null };
  } catch (error) {
    console.error(error);
  }
}
