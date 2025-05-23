'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthService } from '../../../services/core/authService';
import { router } from 'expo-router';
import StyledAlert from '../../common/StyledAlert';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import StyledButton from '../../common/StyledButton';
import LoadingIndicator from '../../common/LoadingIndicator';

const esquemaInicioSesion = Yup.object().shape({
  correo: Yup.string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
  contrasena: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
});

export default function FormularioInicioSesion() {
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
      await AuthService.login(valores.correo, valores.contrasena);
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
      <View style={styles.contenedor}>
        <LoadingIndicator text={isLoadingText} />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
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
          <View style={styles.formulario}>
            <StyledText style={styles.titulo}>Iniciar Sesión</StyledText>

            <View style={styles.campoFormulario}>
              <StyledText style={styles.etiqueta}>
                Correo Electrónico
              </StyledText>
              <InputFormik
                name='correo'
                style={styles.entrada}
                placeholder='Ingresa tu correo'
              />
              {touched.correo && errors.correo && (
                <StyledText style={styles.mensajeError}>
                  {errors.correo}
                </StyledText>
              )}
            </View>

            <View style={styles.campoFormulario}>
              <StyledText style={styles.etiqueta}>Contraseña</StyledText>
              <InputFormik
                name='contrasena'
                style={styles.entrada}
                placeholder='Ingresa tu contraseña'
                secureTextEntry
              />
              {touched.contrasena && errors.contrasena && (
                <StyledText variant='error' style={styles.mensajeError}>
                  {errors.contrasena}
                </StyledText>
              )}
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
                borderColor: 'gray',
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
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  formulario: {
    backgroundColor: '#ffffff',
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
    color: '#333',
    textAlign: 'center',
  },
  campoFormulario: {
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  entrada: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  mensajeError: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  enlaceOlvido: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  textoEnlace: {
    color: '#4CAF50',
    fontSize: 14,
  },
  contenedorBoton: {},
  contenedorRegistro: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  textoRegistro: {
    color: '#666',
    marginRight: 4,
  },
  enlaceRegistro: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
