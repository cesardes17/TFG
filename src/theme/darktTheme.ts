// src/theme/darkTheme.ts
import { colors } from './colors';
import { Theme } from './theme';

export const darkTheme: Theme = {
  cardDefault: colors.gray800,
  cardSelected: colors.primary200,
  stepperActive: colors.primary300,
  stepperInactive: colors.gray700,

  transparent: 'transparent',
  skeleton: colors.gray200,

  background: {
    primary: colors.gray900,
    error: colors.error.background,
    success: colors.success.background,
    warning: colors.warning.background,
    info: colors.info.background,
    navigation: colors.primary950,
  },

  text: {
    primary: colors.white,
    secondary: colors.gray300,
    error: colors.error.text,
    success: colors.success.text,
    warning: colors.warning.text,
    info: colors.info.text,
    dark: colors.gray900,
    light: colors.gray100,
  },
  border: {
    primary: colors.white,
    secondary: colors.gray700,
    error: colors.error.border,
    success: colors.success.border,
    warning: colors.warning.border,
    info: colors.info.border,
  },
  icon: {
    active: colors.primary300,
    inactive: colors.primary600,
    primary: colors.primary400,
  },
  input: {
    default: {
      background: colors.primary100,
      text: colors.primary900,
      border: colors.primary950,
    },
    error: {
      background: colors.error.inputBackground,
      text: colors.error.text,
      border: colors.error.border,
    },
    focused: {
      background: colors.primary600,
      text: colors.primary900,
      border: colors.primary950,
    },
    disabled: {
      background: colors.gray300,
      text: colors.gray600,
      border: colors.gray800,
    },
  },
  alert: {
    success: {
      text: colors.success.text,
      background: colors.gray800,
    },
    info: {
      text: colors.info.text,
      background: colors.gray800,
    },
    warning: {
      text: colors.warning.text,
      background: colors.gray800,
    },
    error: {
      text: colors.error.text,
      background: colors.gray800,
    },
  },
  toast: {
    success: {
      text: colors.white,
      background: colors.success.text,
    },
    info: {
      text: colors.white,
      background: colors.info.text,
    },
    warning: {
      text: colors.white,
      background: colors.warning.text,
    },
    error: {
      text: colors.white,
      background: colors.error.text,
    },
  },
  table: {
    headerBackground: colors.gray800, // Encabezado gris oscuro
    headerText: colors.white, // Texto blanco
    rowEvenBackground: colors.gray900, // Filas pares más claras
    rowOddBackground: colors.black, // Filas impares fondo negro
    rowBorder: colors.gray700, // Borde gris intermedio
    rowText: colors.gray100, // Texto claro
  },
  button: {
    primary: {
      background: colors.primary500,
      border: colors.primary700,
      text: colors.white,
    },
    outline: {
      background: colors.transparent,
      border: colors.primary700,
      text: colors.primary700,
    },
    error: {
      background: colors.error.background,
      border: colors.error.border,
      text: colors.white,
    },
    disabled: {
      background: colors.gray300,
      border: colors.gray400,
      text: colors.gray600,
    },
  },
};
