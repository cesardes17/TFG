import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useTheme } from '../../../contexts/ThemeContext';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import { AuthService } from '../../../services/authService';
import StyledAlert from '../../common/StyledAlert';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { loginValidationSchema } from '../../../validations/auth';

interface FormValues {
  correo: string;
  password: string;
}

interface LoginFormProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function LoginForm({ setIsLoading }: LoginFormProps) {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  const initialValues: FormValues = {
    correo: '',
    password: '',
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.login(values.correo, values.password);
      router.replace('/');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <StyledAlert message={error} variant='error' />}
      <Formik
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: formikSubmit }) => (
          <View style={styles.container}>
            <View style={styles.formContainer}>
              <View style={styles.inputsContainer}>
                <InputFormik
                  name='correo'
                  placeholder='Correo'
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
                <InputFormik
                  name='password'
                  placeholder='Contraseña'
                  secureTextEntry
                />
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: theme.icon.active },
                  ]}
                  onPress={() => formikSubmit()}
                >
                  <StyledText
                    style={[styles.buttonText, { color: theme.text.dark }]}
                  >
                    Iniciar Sesión
                  </StyledText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    { borderColor: theme.border.primary },
                  ]}
                  onPress={() => router.replace('/register')}
                >
                  <StyledText
                    style={[styles.buttonText, { color: theme.text.primary }]}
                  >
                    Crear una cuenta
                  </StyledText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 24,
  },
  inputsContainer: {
    width: Platform.OS === 'web' ? '75%' : '100%',
    alignSelf: 'center',
    gap: 16,
  },
  buttonsContainer: {
    width: Platform.OS === 'web' ? '50%' : '100%',
    alignSelf: 'center',
    gap: 16,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
});
