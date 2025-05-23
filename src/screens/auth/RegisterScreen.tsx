// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';

import { useUser } from '../../contexts/UserContext';

import RegisterForm, {
  ValoresFormularioRegistro,
} from '../../components/forms/auth/RegisterForm';
import registrationHelper from '../../utils/registrationHelper';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState('');

  const valoresIniciales: ValoresFormularioRegistro = {
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    nombre: '',
    apellidos: '',
    rol: '' as 'jugador' | 'espectador',
    altura: '',
    peso: '',
    posicionPreferida: '',
    dorsalPreferido: '',
    imagenPerfil: '',
  };

  const manejarRegistro = async (valores: ValoresFormularioRegistro) => {
    console.log('valores:');
    console.log(valores);
    setIsLoading(true);
    await registrationHelper(valores, setIsLoadingText);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingIndicator text={isLoadingText} />
      </View>
    );
  }
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <RegisterForm
        setIsLoading={setIsLoading}
        setLoadingText={setIsLoadingText}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarRegistro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
