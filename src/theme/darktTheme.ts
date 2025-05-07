// /src/theme/darkTheme.ts:

import { colors } from './colors';
import { Theme } from './theme';

export const darkTheme: Theme = {
  background: colors.gray900,
  text: {
    primary: colors.white,
    secondary: colors.gray300,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  border: {
    primary: colors.primary300,
    secondary: colors.gray700,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },

  icon: {
    active: colors.primary300,
    inactive: colors.primary600,
  },
};
