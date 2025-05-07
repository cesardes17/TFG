import * as Yup from 'yup';
import { Role } from '../types/User';

export const registerValidationSchemas = {
  step1: Yup.object().shape({
    correo: Yup.string().email('Correo inválido').required('Requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
      .required('Requerido'),
    nombre: Yup.string().required('Requerido'),
  }),
  step2: (roles: { value: Role }[]) =>
    Yup.object().shape({
      role: Yup.string()
        .oneOf(
          roles.map((r) => r.value),
          'Rol inválido'
        )
        .required('Requerido'),
    }),
};