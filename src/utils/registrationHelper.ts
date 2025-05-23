// /src/utils/registrationHelper.ts
import { ToastType } from '../components/common/Toast';
import { ValoresFormularioRegistro } from '../components/forms/auth/RegisterForm';
import { AuthService } from '../services/core/authService';
import { StorageService } from '../services/core/storageService';
import { UserService } from '../services/userService';
import type { OtherRegistration, PlayerRegistration } from '../types/User';

export default async function registrationHelper(
  datosFormulario: ValoresFormularioRegistro,
  onUpdate: (step: string) => void
): Promise<{ type: ToastType; message: string }> {
  try {
    //paso 1: registro en auth
    onUpdate('Creando usuario...');
    const res = await AuthService.register(
      datosFormulario.correo,
      datosFormulario.contraseña
    );
    if (!res.success) {
      throw new Error(res.errorMessage);
    }
    const userId = res.data.uid;

    //paso 2: comprobar rol elegido
    if (datosFormulario.rol === 'espectador') {
      const payload: OtherRegistration = {
        correo: datosFormulario.correo,
        nombre: datosFormulario.nombre,
        apellidos: datosFormulario.apellidos,
        rol: datosFormulario.rol,
      };

      onUpdate('Guardando datos del usuario...');

      const res = await UserService.createUser(userId, payload);
      if (!res.success) {
        throw new Error('Error al guardar los datos del usuario');
      }
    } else {
      onUpdate('Subiendo imagen del usuario...');
      const resImagen = await StorageService.uploadFile(
        'fotos_jugadores',
        datosFormulario.imagenPerfil
      );
      if (!resImagen.success || !resImagen.data) {
        throw new Error('Error al subir la imagen...');
      }
      const payload: PlayerRegistration = {
        correo: datosFormulario.correo,
        nombre: datosFormulario.nombre,
        apellidos: datosFormulario.apellidos,
        rol: datosFormulario.rol,
        altura: parseInt(datosFormulario.altura),
        dorsal: parseInt(datosFormulario.dorsalPreferido),
        peso: parseInt(datosFormulario.peso),
        posicion: datosFormulario.posicionPreferida,
        sancionado: false,
        fotoPath: resImagen.data.fileName,
        fotoUrl: resImagen.data.url,
      };

      onUpdate('Guardando datos del usuario...');

      const res = await UserService.createUser(userId, payload);
      if (!res.success) {
        throw new Error('Error al guardar los datos del usuario...');
      }
    }
    return {
      type: 'success',
      message: 'Cuenta creada con éxito!',
    };
  } catch (error) {
    return {
      type: 'error',
      message:
        error instanceof Error ? error.message : 'Error al crear la cuenta',
    };
  }
}
