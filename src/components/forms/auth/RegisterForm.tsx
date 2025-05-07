import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { Role, UserRegistration } from '../../../types/User';
import { useTheme } from '../../../contexts/ThemeContext';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import SelectableCardGroup from '../../common/SelectableCardGroup';
import { registerValidationSchemas } from '../../../validations/auth';
import registrationHelper from '../../../utils/registrationHelper';
import StyledAlert from '../../common/StyledAlert';
import ImagePicker from '../../common/ImagePicker';
import { router } from 'expo-router';

const roles: { label: string; description: string; value: Role }[] = [
  {
    label: 'Espectador',
    description: 'Solo ver contenido',
    value: 'espectador',
  },
  { label: 'Jugador', description: 'Participar en partidos', value: 'jugador' },
];

interface FormValues {
  correo: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellidos: string;
  role: Role;
  // Campos adicionales para jugador
  altura?: number;
  peso?: number;
  dorsal?: number;
  posicion?: string;
  photoURL?: string;
}

interface RegisterFormProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function RegisterForm({ setIsLoading }: RegisterFormProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null); // Agrega el estado de error

  const initialValues: FormValues = {
    correo: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    role: 'espectador',
    // Valores iniciales para campos de jugador
    altura: undefined,
    peso: undefined,
    dorsal: undefined,
    posicion: '',
    photoURL: '',
  };

  const renderStep3 = () => (
    <>
      <InputFormik
        name='altura'
        placeholder='Altura (cm)'
        keyboardType='numeric'
      />
      <InputFormik name='peso' placeholder='Peso (kg)' keyboardType='numeric' />
      <InputFormik
        name='dorsal'
        placeholder='Dorsal preferido'
        keyboardType='numeric'
      />
    </>
  );

  const posiciones = [
    { label: 'Base', description: 'Point Guard', value: 'base' },
    { label: 'Escolta', description: 'Shooting Guard', value: 'escolta' },
    { label: 'Alero', description: 'Small Forward', value: 'alero' },
    { label: 'Ala-Pivot', description: 'Power Forward', value: 'ala-pivot' },
    { label: 'Pivot', description: 'Center', value: 'pivot' },
  ];

  const renderStep4 = (
    values: FormValues,
    setFieldValue: (field: string, value: any) => void
  ) => (
    <SelectableCardGroup
      options={posiciones}
      value={values.posicion || ''}
      onChange={(value) => setFieldValue('posicion', value)}
    />
  );

  const renderStep5 = (
    values: FormValues,
    setFieldValue: (field: string, value: any) => void
  ) => (
    <>
      <ImagePicker
        onImageSelected={(uri) => setFieldValue('photoURL', uri)}
        placeholder='Selecciona una foto de perfil'
      />
    </>
  );

  const getTotalSteps = (values: FormValues) => {
    return values.role === 'jugador' ? 5 : 2;
  };

  const renderCurrentStep = (
    values: FormValues,
    setFieldValue: (field: string, value: any) => void
  ) => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2(values, setFieldValue);
      case 3:
        return renderStep3();
      case 4:
        return renderStep4(values, setFieldValue);
      case 5:
        return renderStep5(values, setFieldValue);
      default:
        return null;
    }
  };

  const renderStep1 = () => (
    <>
      <InputFormik
        name='correo'
        placeholder='Correo'
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <InputFormik name='password' placeholder='Contraseña' secureTextEntry />
      <InputFormik
        name='confirmPassword'
        placeholder='Confirmar contraseña'
        secureTextEntry
      />
      <InputFormik name='nombre' placeholder='Nombre' />
      <InputFormik name='apellidos' placeholder='Apellidos' />
    </>
  );

  const renderStep2 = (
    values: FormValues,
    setFieldValue: (field: string, value: any) => void
  ) => (
    <SelectableCardGroup
      options={roles}
      value={values.role}
      onChange={(value) => setFieldValue('role', value)}
    />
  );

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    console.log('Registro con:', values);

    // Check if role is valid and handle jugador role separately
    if (values.role !== 'espectador' && values.role !== 'jugador') {
      console.error('Role not allowed for registration');
      return;
    }

    if (values.role === 'jugador') {
      // Validate that all required player fields are present
      if (
        !values.altura ||
        !values.peso ||
        !values.dorsal ||
        !values.posicion
      ) {
        setError('Todos los campos son requeridos para jugadores');
        return;
      }

      const user: UserRegistration = {
        correo: values.correo,
        nombre: values.nombre,
        role: values.role,
        apellidos: values.apellidos,
        altura: Number(values.altura),
        peso: Number(values.peso),
        dorsal: Number(values.dorsal),
        posicion: values.posicion,
        photoURL: values.photoURL || '',
      };
      try {
        await registrationHelper(user, values.password);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
        router.replace('/');
      }
    } else {
      // Handle spectator registration
      const user: UserRegistration = {
        correo: values.correo,
        nombre: values.nombre,
        role: values.role,
        apellidos: values.apellidos,
      };
      try {
        await registrationHelper(user, values.password);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
        router.replace('/');
      }
    }
  };

  return (
    <>
      {error && <StyledAlert message={error} variant='error' />}
      <Formik
        initialValues={initialValues}
        validationSchema={
          step === 1
            ? registerValidationSchemas.step1
            : step === 2
            ? registerValidationSchemas.step2(roles)
            : step === 3
            ? registerValidationSchemas.step3
            : step === 4
            ? registerValidationSchemas.step4
            : registerValidationSchemas.step5
        }
        onSubmit={(values) => {
          const totalSteps = getTotalSteps(values);
          if (step < totalSteps) {
            setStep(step + 1);
          } else {
            handleSubmit(values);
          }
        }}
      >
        {({ handleSubmit: formikSubmit, values, setFieldValue }) => (
          <View style={styles.container}>
            <View style={styles.headerSection}>
              <StyledText
                style={[styles.progress, { color: theme.text.primary }]}
              >
                Paso {step} de {getTotalSteps(values)}
              </StyledText>
            </View>

            <View style={styles.formSection}>
              {renderCurrentStep(values, setFieldValue)}
            </View>

            <View style={styles.footerSection}>
              <View style={styles.buttonContainer}>
                {step > 1 && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.backButton,
                      { borderColor: theme.border.primary },
                    ]}
                    onPress={() => setStep(step - 1)}
                  >
                    <StyledText
                      style={[styles.buttonText, { color: theme.text.primary }]}
                    >
                      Atrás
                    </StyledText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.button,
                    step > 1 && styles.nextButton,
                    { backgroundColor: theme.icon.active },
                  ]}
                  onPress={() => formikSubmit()}
                >
                  <StyledText
                    style={[styles.buttonText, { color: theme.text.dark }]}
                  >
                    {step < getTotalSteps(values) ? 'Siguiente' : 'Registrarse'}
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
    justifyContent: 'space-between',
  },
  headerSection: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  formSection: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  footerSection: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progress: {
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  nextButton: {
    flex: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
