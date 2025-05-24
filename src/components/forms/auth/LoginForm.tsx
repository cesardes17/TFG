'use client';

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthService } from '../../../services/core/authService';
import { router } from 'expo-router';
import StyledAlert from '../../common/StyledAlert';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import StyledButton from '../../common/StyledButton';
import LoadingIndicator from '../../common/LoadingIndicator';
import { useTheme } from '../../../contexts/ThemeContext';

const esquemaInicioSesion = Yup.object().shape({
  correo: Yup.string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
  contrasena: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
});

export default function FormularioInicioSesion() {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState('');
  const valoresIniciales = {
    correo: '',
    contrasena: '',
  };

  const manejarEnvio = async (valores: typeof valoresIniciales) => {
    setIsLoading(true);
    setIsLoadingText('Iniciando Sesión');
    setError(null);
    try {
      const res = await AuthService.login(valores.correo, valores.contrasena);
      if (!res.success) {
        console.log('Error al iniciar sesión', res.errorMessage);
        throw new Error(res.errorMessage);
      }
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
      setIsLoadingText('');
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.contenedor,
          { backgroundColor: theme.background.primary },
        ]}
      >
        <LoadingIndicator text={isLoadingText} />
      </View>
    );
  }

  return (
    <View
      style={[styles.contenedor, { backgroundColor: theme.background.primary }]}
    >
      {error && <StyledAlert variant='error' message={error} />}

      <Formik
        initialValues={valoresIniciales}
        validationSchema={esquemaInicioSesion}
        onSubmit={manejarEnvio}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
        }) => (
          <View
            style={[styles.formulario, { backgroundColor: theme.cardDefault }]}
          >
            <StyledText style={[styles.titulo, { color: theme.text.primary }]}>
              Iniciar Sesión
            </StyledText>

            <View style={styles.campoFormulario}>
              <StyledText
                style={[styles.etiqueta, { color: theme.text.primary }]}
              >
                Correo Electrónico
              </StyledText>
              <InputFormik
                name='correo'
                style={styles.entrada}
                placeholder='Ingresa tu correo'
              />
            </View>

            <View style={styles.campoFormulario}>
              <StyledText
                style={[styles.etiqueta, { color: theme.text.primary }]}
              >
                Contraseña
              </StyledText>
              <InputFormik
                name='contrasena'
                style={styles.entrada}
                placeholder='Ingresa tu contraseña'
                secureTextEntry
              />
            </View>

            <View style={styles.contenedorBoton}>
              <StyledButton
                title={isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                onPress={handleSubmit as any}
                disabled={isLoading}
              />
            </View>
            <View
              style={{
                height: 0,
                borderWidth: 1,
                marginVertical: 20,
                borderColor: theme.border.primary,
              }}
            />
            <View style={styles.contenedorBoton}>
              <StyledButton
                variant='outline'
                title={'Crea una cuenta'}
                onPress={() => router.push('/register')}
                disabled={isLoading}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  formulario: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  campoFormulario: {
    marginBottom: 16,
  },
  etiqueta: {
    marginBottom: 8,
    fontWeight: '500',
  },
  entrada: {
    marginBottom: 4,
  },
  mensajeError: {
    fontSize: 12,
    marginTop: 4,
  },
  contenedorBoton: {
    marginTop: 8,
  },
});
