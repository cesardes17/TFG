// /src/theme/lightTheme.ts:

import { colors } from './colors';
import { Theme } from './theme';

/**
 * Light theme using color tokens
 */
export const lightTheme: Theme = {
  background: colors.gray100,
  text: {
    primary: colors.black,
    secondary: colors.gray600,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  border: {
    primary: colors.primary600,
    secondary: colors.gray300,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  icon: {
    active: colors.primary600,
    inactive: colors.primary400,
  },
};
