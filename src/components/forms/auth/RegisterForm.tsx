// src/components/forms/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';
import {
  Role,
  PlayerRegistration,
  OtherRegistration,
} from '../../../types/User';
import { useTheme } from '../../../contexts/ThemeContext';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import SelectableCardGroup from '../../common/SelectableCardGroup';
import { registerValidationSchemas } from '../../../validations/auth';
import registrationHelper from '../../../utils/registrationHelper';
import StyledAlert from '../../common/StyledAlert';
import ImagePicker from '../../common/ImagePicker';

type FormValues = {
  correo: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellidos: string;
  role: Role;
  altura?: number;
  peso?: number;
  dorsal?: number;
  posicion?: string;
  photoURL?: string;
};

interface Props {
  setIsLoading: (b: boolean) => void;
}

export default function RegisterForm({ setIsLoading }: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const initialValues: FormValues = {
    correo: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    role: 'espectador',
    altura: undefined,
    peso: undefined,
    dorsal: undefined,
    posicion: '',
    photoURL: '',
  };

  const roles = [
    {
      label: 'Espectador',
      description: 'Solo ver contenido',
      value: 'espectador' as Role,
    },
    {
      label: 'Jugador',
      description: 'Participar en partidos',
      value: 'jugador' as Role,
    },
  ];

  const getTotalSteps = (values: FormValues) =>
    values.role === 'jugador' ? 5 : 2;

  const renderStep = (
    values: FormValues,
    setFieldValue: (f: string, v: any) => void
  ) => {
    switch (step) {
      case 1:
        return (
          <>
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
            <InputFormik
              name='confirmPassword'
              placeholder='Confirmar'
              secureTextEntry
            />
            <InputFormik name='nombre' placeholder='Nombre' />
            <InputFormik name='apellidos' placeholder='Apellidos' />
          </>
        );
      case 2:
        return (
          <SelectableCardGroup
            options={roles}
            value={values.role}
            onChange={(v) => setFieldValue('role', v)}
          />
        );
      case 3:
        return (
          <>
            <InputFormik
              name='altura'
              placeholder='Altura (cm)'
              keyboardType='numeric'
            />
            <InputFormik
              name='peso'
              placeholder='Peso (kg)'
              keyboardType='numeric'
            />
            <InputFormik
              name='dorsal'
              placeholder='Dorsal preferido'
              keyboardType='numeric'
            />
          </>
        );
      case 4:
        return (
          <SelectableCardGroup
            options={[
              { label: 'Base', description: 'Point Guard', value: 'base' },
              {
                label: 'Escolta',
                description: 'Shooting Guard',
                value: 'escolta',
              },
              { label: 'Alero', description: 'Small Forward', value: 'alero' },
              {
                label: 'Ala-Pivot',
                description: 'Power Forward',
                value: 'ala-pivot',
              },
              { label: 'Pivot', description: 'Center', value: 'pivot' },
            ]}
            value={values.posicion!}
            onChange={(v) => setFieldValue('posicion', v)}
          />
        );
      case 5:
        return (
          <ImagePicker
            onImageSelected={(uri) => setFieldValue('photoURL', uri)}
            placeholder='Selecciona una foto de perfil'
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      if (values.role === 'jugador') {
        if (
          !values.altura ||
          !values.peso ||
          !values.dorsal ||
          !values.posicion
        ) {
          throw new Error('Todos los campos de jugador son obligatorios');
        }
        const payload: PlayerRegistration = {
          correo: values.correo,
          nombre: values.nombre,
          apellidos: values.apellidos,
          role: 'jugador',
          altura: Number(values.altura),
          peso: Number(values.peso),
          dorsal: Number(values.dorsal),
          posicion: values.posicion!,
          photoURL: values.photoURL || '',
          sancionado: false,
        };
        await registrationHelper(payload, values.password);
      } else {
        const payload: OtherRegistration = {
          correo: values.correo,
          nombre: values.nombre,
          apellidos: values.apellidos,
          role: 'espectador',
        };
        await registrationHelper(payload, values.password);
      }

      // sólo aquí, una vez todo OK, desactivo loading y navego
      setIsLoading(false);
      router.replace('/');
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <StyledAlert message={error} variant='error' />}
      <Formik
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
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
          const total = getTotalSteps(values);
          if (step < total) {
            setStep(step + 1);
          } else {
            handleSubmit(values);
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <View style={styles.container}>
            <StyledText
              style={[styles.progress, { color: theme.text.primary }]}
            >
              Paso {step} de {getTotalSteps(values)}
            </StyledText>
            <View style={styles.formSection}>
              {renderStep(values, setFieldValue)}
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
                  onPress={() => handleSubmit()}
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
  container: { flex: 1, padding: 16, justifyContent: 'space-between' },
  progress: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
  formSection: { flex: 1 },
  footerSection: {},
  buttonContainer: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  backButton: { borderWidth: 2, backgroundColor: 'transparent' },
  nextButton: { flex: 2 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});
