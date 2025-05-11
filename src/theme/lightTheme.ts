// src/theme/lightTheme.ts
import { colors } from './colors';
import { Theme } from './theme';

export const lightTheme: Theme = {
  cardDefault: colors.white,
  cardSelected: colors.primary50,
  stepperActive: colors.primary600,
  stepperInactive: colors.gray300,

  transparent: 'transparent',
  skeleton: colors.gray200,
  background: {
    primary: colors.gray100,
    error: colors.error.background,
    success: colors.success.background,
    warning: colors.warning.background,
    info: colors.info.background,
    navigation: colors.primary900,
  },

  text: {
    primary: colors.black,
    secondary: colors.gray600,
    error: colors.error.text,
    success: colors.success.text,
    warning: colors.warning.text,
    info: colors.info.text,
    dark: colors.gray900,
    light: colors.gray100,
  },
  border: {
    primary: colors.primary600,
    secondary: colors.gray300,
    error: colors.error.border,
    success: colors.success.border,
    warning: colors.warning.border,
    info: colors.info.border,
  },
  icon: {
    active: colors.primary200,
    inactive: colors.primary500,
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
      background: colors.primary400,
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
      background: colors.success.alertBackground,
    },
    info: {
      text: colors.info.text,
      background: colors.info.alertBackground,
    },
    warning: {
      text: colors.warning.text,
      background: colors.warning.alertBackground,
    },
    error: {
      text: colors.error.text,
      background: colors.error.alertBackground,
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
};
