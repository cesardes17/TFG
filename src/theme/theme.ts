// src/theme/Theme.ts
export interface Theme {
  // Fondos
  cardDefault: string;
  cardSelected: string;
  stepperActive: string;
  stepperInactive: string;

  transparent: string;

  background: {
    primary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    navigation: string;
  };

  // Texto
  text: {
    primary: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    dark: string;
    light: string;
  };
  // Bordes
  border: {
    primary: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  // Iconos
  icon: { active: string; inactive: string };

  input: {
    default: {
      background: string;
      text: string;
      border: string;
    };
    error: {
      background: string;
      text: string;
      border: string;
    };
    focused: {
      background: string;
      text: string;
      border: string;
    };
    disabled: {
      background: string;
      text: string;
      border: string;
    };
  };
  alert: {
    success: {
      text: string;
      background: string;
    };
    info: {
      text: string;
      background: string;
    };
    warning: {
      text: string;
      background: string;
    };
    error: {
      text: string;
      background: string;
    };
  };
  toast: {
    success: {
      text: string;
      background: string;
    };
    info: {
      text: string;
      background: string;
    };
    warning: {
      text: string;
      background: string;
    };
    error: {
      text: string;
      background: string;
    };
  };
}
