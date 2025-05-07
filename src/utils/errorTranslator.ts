// src/utils/errorTranslator.ts
/**
 * Mapea códigos de error de Firebase a mensajes en español
 */
const authErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/user-disabled': 'La cuenta de usuario ha sido deshabilitada.',
  'auth/user-not-found': 'No existe ninguna cuenta con ese correo.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/email-already-in-use': 'El correo ya está en uso.',
  'auth/operation-not-allowed': 'Operación no permitida.',
  'auth/weak-password': 'La contraseña es demasiado débil.',
};

/**
 * Traduce un error dado su código, con mensaje por defecto
 */
export function translateAuthError(
  code: string,
  defaultMessage = 'Ha ocurrido un error de autenticación.'
): string {
  return authErrorMessages[code] || defaultMessage;
}
