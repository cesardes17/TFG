import { ToastType } from '../components/common/Toast';
import { ValoresFormulario } from '../components/forms/auth/PerfilForm';
import { FirestoreService } from '../services/core/firestoreService';
import { StorageService } from '../services/core/storageService';
import { UserService } from '../services/userService';
import { OtherUser, PlayerUser, User } from '../types/User';

export default async function editPerfilHelper(
  user: User,
  datosFormulario: ValoresFormulario,
  onUpdate: (step: string) => void
): Promise<{ type: ToastType; message: string }> {
  //Comprobamos rol que quiere ser
  if (datosFormulario.rol === 'jugador') {
    let imagenPath =
      datosFormulario.imagenExistente && user.rol === 'jugador'
        ? user.fotoPath
        : '';
    let imagenUrl =
      datosFormulario.imagenExistente && user.rol === 'jugador'
        ? user.fotoUrl
        : '';

    if (datosFormulario.imagenPerfil !== '') {
      //si la imagen existe, la borramos
      if (user.rol === 'jugador' && user.fotoPath !== '') {
        onUpdate('Borrando la imagen actual del usario...');
        const res = await StorageService.deleteFile(
          'fotos_jugadores',
          user.fotoPath
        );
        if (!res.success) {
          return {
            type: 'error',
            message: 'Error al borrar imagen',
          };
        }
      }
      onUpdate('Subiendo la imagen del usario...');

      const res = await StorageService.uploadFile(
        'fotos_jugadores',
        datosFormulario.imagenPerfil
      );
      if (!res.success || !res.data) {
        return {
          type: 'error',
          message: 'Error al subir imagen',
        };
      }
      imagenUrl = res.data.url;
      imagenPath = res.data.fileName;
    }
    let payload: PlayerUser;
    //comprobamos si el usuario actual es jugador o no
    if (user.rol === 'jugador') {
      payload = {
        uid: user.uid,
        correo: user.correo,
        rol: datosFormulario.rol,
        nombre: datosFormulario.nombre,
        apellidos: datosFormulario.apellidos,
        altura: parseInt(datosFormulario.altura),
        peso: parseInt(datosFormulario.peso),
        dorsal: parseInt(datosFormulario.dorsalPreferido),
        posicion: datosFormulario.posicionPreferida,
        fechaCreacion: user.fechaCreacion,
        sancionado: user.sancionado,
        fotoPath: imagenPath,
        fotoUrl: imagenUrl,
      };
    } else {
      //si no era jugador, creamos el payload
      payload = {
        uid: user.uid,
        correo: user.correo,
        rol: datosFormulario.rol,
        nombre: datosFormulario.nombre,
        apellidos: datosFormulario.apellidos,
        altura: parseInt(datosFormulario.altura),
        peso: parseInt(datosFormulario.peso),
        dorsal: parseInt(datosFormulario.dorsalPreferido),
        posicion: datosFormulario.posicionPreferida,
        fechaCreacion: user.fechaCreacion,
        sancionado: false,
        fotoPath: imagenPath,
        fotoUrl: imagenUrl,
        ultimaVisitaTablon: user.ultimaVisitaTablon
          ? user.ultimaVisitaTablon
          : FirestoreService.getDeleteField(),
      };
    }
    console.log('Actualizando perfil', payload);
    onUpdate('Actualizando perfil...');

    const res = await UserService.updateUserProfile(payload.uid, payload);
    console.log('Res', res);
    if (res.success) {
      return {
        type: 'success',
        message: 'Perfil actualizado correctamente',
      };
    } else {
      return {
        type: 'error',
        message: 'Error al actualizar perfil',
      };
    }
  } else {
    const payload: OtherUser = {
      uid: user.uid,
      correo: user.correo,
      rol: datosFormulario.rol,
      nombre: datosFormulario.nombre,
      apellidos: datosFormulario.apellidos,
      fechaCreacion: user.fechaCreacion,
      ultimaVisitaTablon: user.ultimaVisitaTablon
        ? user.ultimaVisitaTablon
        : FirestoreService.getDeleteField(),
    };
    onUpdate('Actualizando perfil...');

    const res = await UserService.updateUserProfile(payload.uid, payload);

    if (res.success) {
      return {
        type: 'success',
        message: 'Perfil actualizado correctamente',
      };
    } else {
      return {
        type: 'error',
        message: 'Error al actualizar perfil',
      };
    }
  }
}
