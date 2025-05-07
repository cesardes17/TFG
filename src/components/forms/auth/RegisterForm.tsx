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
}

export default function RegisterForm() {
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
  };

  const handleSubmit = async (values: FormValues) => {
    console.log('Registro con:', values);

    // Only allow roles that match UserRegistration type
    if (
      values.role !== 'espectador' &&
      values.role !== 'arbitro' &&
      values.role !== 'coorganizador' &&
      values.role !== 'organizador'
    ) {
      console.error('Role not allowed for registration');
      return;
    }

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

  return (
    <>
      {error && <StyledAlert message={error} variant='error' />}
      <Formik
        initialValues={initialValues}
        validationSchema={
          step === 1
            ? registerValidationSchemas.step1
            : registerValidationSchemas.step2(roles)
        }
        onSubmit={(values) => {
          if (step < 2) {
            setStep(2);
          } else {
            handleSubmit(values);
          }
        }}
      >
        {({ handleSubmit: formikSubmit, values, setFieldValue }) => (
          <View style={styles.container}>
            <StyledText
              style={[styles.progress, { color: theme.text.primary }]}
            >
              Paso {step} de 2
            </StyledText>

            {step === 1 ? renderStep1() : renderStep2(values, setFieldValue)}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.icon.active }]}
              onPress={() => formikSubmit()}
            >
              <StyledText
                style={[styles.buttonText, { color: theme.text.dark }]}
              >
                {step === 1 ? 'Siguiente' : 'Registrarse'}
              </StyledText>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  progress: {
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  card: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4, // Añadir margen inferior
  },
  cardDesc: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8, // Reducir la opacidad para mejor contraste
  },
  button: {
    padding: 16, // Aumentar el padding
    borderRadius: 12, // Aumentar el radio del borde
    alignItems: 'center',
    marginTop: 24, // Aumentar el margen superior
    width: '100%', // Ocupar todo el ancho disponible
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
