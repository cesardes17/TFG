// src/theme/darkTheme.ts
import { colors } from './colors';
import { Theme } from './theme';

export const darkTheme: Theme = {
  cardDefault: colors.gray800,
  cardSelected: colors.primary200,
  stepperActive: colors.primary300,
  stepperInactive: colors.gray700,
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
    primary: colors.primary300,
    secondary: colors.gray700,
    error: colors.error.border,
    success: colors.success.border,
    warning: colors.warning.border,
    info: colors.info.border,
  },
  icon: {
    active: colors.primary300,
    inactive: colors.primary600,
  },
  input: {
    default: {
      background: colors.primary100,
      text: colors.primary900,
      border: colors.primary950,
    },
    error: {
      background: colors.error.background,
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
};
