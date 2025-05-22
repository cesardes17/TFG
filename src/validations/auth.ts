// /src/validations/auth.ts
import * as Yup from 'yup';
import { Rol } from '../types/User';

export const registerValidationSchemas = {
  step1: Yup.object().shape({
    correo: Yup.string().email('Correo inválido').required('Requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
      .required('Requerido'),
    nombre: Yup.string().required('Requerido'),
    apellidos: Yup.string().required('Requerido'),
  }),
  step2: (roles: { value: Rol }[]) =>
    Yup.object().shape({
      rol: Yup.string()
        .oneOf(
          roles.map((r) => r.value),
          'Rol inválido'
        )
        .required('Requerido'),
    }),
  step3: Yup.object().shape({
    altura: Yup.number()
      .min(100, 'La altura debe ser mayor a 100cm')
      .max(250, 'La altura debe ser menor a 250cm')
      .required('Requerido'),
    peso: Yup.number()
      .min(30, 'El peso debe ser mayor a 30kg')
      .max(200, 'El peso debe ser menor a 200kg')
      .required('Requerido'),
    dorsal: Yup.number()
      .min(0, 'El dorsal debe ser mayor a 0')
      .max(99, 'El dorsal debe ser menor a 99')
      .required('Requerido'),
  }),
  step4: Yup.object().shape({
    posicion: Yup.string()
      .oneOf(
        ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'],
        'Posición inválida'
      )
      .required('Requerido'),
  }),
  step5: Yup.object().shape({
    photoURL: Yup.string().optional(),
  }),
};

export const loginValidationSchema = Yup.object().shape({
  correo: Yup.string().email('Correo inválido').required('Requerido'),
  password: Yup.string().required('Requerido'),
});
