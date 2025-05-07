// src/theme/Theme.ts

export interface Theme {
  background: string;
  text: {
    primary: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  border: {
    primary: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  icon: {
    active: string;
    inactive: string;
  };
}
