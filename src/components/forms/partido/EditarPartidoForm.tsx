'use client';

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import StyledText from '../../common/StyledText';
import StyledAlert from '../../common/StyledAlert';
import StyledButton from '../../common/StyledButton';
import LoadingIndicator from '../../common/LoadingIndicator';
import { useTheme } from '../../../contexts/ThemeContext';
import StyledDateTimePicker from '../../common/StyledDateTimePicker';
import SelectableCardGroup, { Option } from '../../common/SelectableCardGroup';
import { Partido } from '../../../types/Partido';
import { TipoCompeticion } from '../../../types/Competicion';

const esquemaEditarPartido = Yup.object().shape({
  fechaHora: Yup.date().required(
    'La fecha y hora del partido son obligatorias'
  ),
  cancha: Yup.string().required('Selecciona un pabellón'),
});
const pabellonesDisponibles: Option<string>[] = [
  { value: 'pabMontaña', label: 'Pabellón de la Montaña', description: '' },
  { value: 'pabVega', label: 'Pabellón de la Vega', description: '' },
];

interface PartidoFormProps {
  partido: Partido;
}

export default function EditarPartidoForm({ partido }: PartidoFormProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState('');

  const valoresIniciales = {
    fechaHora: partido?.fecha ? new Date(partido.fecha) : new Date(),
    cancha: partido?.cancha || '',
  };
  const manejarEnvio = async (valores: typeof valoresIniciales) => {
    setIsLoading(true);
    setIsLoadingText('Actualizando partido');
    setError(null);
    try {
      // await PartidoService.actualizarPartido(partido.id, valores);
      router.back();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el partido');
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
        validationSchema={esquemaEditarPartido}
        onSubmit={manejarEnvio}
      >
        {({ handleSubmit, values, setFieldValue, errors, touched }) => (
          <View
            style={[styles.formulario, { backgroundColor: theme.cardDefault }]}
          >
            <StyledText style={[styles.titulo, { color: theme.text.primary }]}>
              Editar Partido
            </StyledText>

            {step === 1 && (
              <View style={styles.campoFormulario}>
                <StyledText
                  style={[styles.etiqueta, { color: theme.text.primary }]}
                >
                  Fecha y hora del partido
                </StyledText>
                <StyledDateTimePicker
                  mode='datetime'
                  value={values.fechaHora}
                  onChange={(fechaHora: Date) =>
                    setFieldValue('fechaHora', fechaHora)
                  }
                />
              </View>
            )}

            {step === 2 && (
              <>
                <View style={styles.campoFormulario}>
                  <StyledText
                    style={[styles.etiqueta, { color: theme.text.primary }]}
                  >
                    Selecciona el pabellón
                  </StyledText>
                  <SelectableCardGroup
                    options={pabellonesDisponibles}
                    value={values.cancha}
                    onChange={(id: string) => setFieldValue('cancha', id)}
                  />
                </View>

                <StyledButton
                  title='Guardar cambios'
                  onPress={handleSubmit as any}
                />

                <View style={{ marginTop: 12 }}>
                  <StyledButton
                    variant='outline'
                    title='Volver'
                    onPress={() => setStep(1)}
                  />
                </View>
              </>
            )}
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
});
