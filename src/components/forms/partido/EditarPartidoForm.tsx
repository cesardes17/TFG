'use client';

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Formik, FormikProps } from 'formik';
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
import { partidoService } from '../../../services/partidoService';
import { useTemporadaContext } from '../../../contexts/TemporadaContext';
import { useToast } from '../../../contexts/ToastContext';
import useArbitros from '../../../hooks/useArbitros';
import SelectorArbitro from '../SelectorArbitro';

const pabellonesDisponibles: Option<string>[] = [
  {
    value: 'pabMontaña',
    label: 'Pabellón de la Montaña',
    description: 'Pabellón de la Montaña de Gáldar',
  },
  {
    value: 'pabVega',
    label: 'Pabellón de la Vega',
    description: 'Pabellón de la Vega de San José',
  },
];

// Esquemas por paso
const esquemaPaso1 = Yup.object().shape({
  fechaHora: Yup.date()
    .min(new Date(), 'La fecha y hora deben ser actuales o futuras')
    .required('La fecha y hora del partido son obligatorias'),
});

const esquemaPaso2 = Yup.object().shape({
  cancha: Yup.string().required('Selecciona un pabellón'),
});

const esquemaPaso3 = Yup.object().shape({
  arbitro1: Yup.object({
    id: Yup.string().required(),
    nombre: Yup.string().required(),
    apellidos: Yup.string().required(),
    correo: Yup.string().email().required(),
  }).required('Selecciona el árbitro principal'),
  arbitro2: Yup.object({
    id: Yup.string().required(),
    nombre: Yup.string().required(),
    apellidos: Yup.string().required(),
    correo: Yup.string().email().required(),
  }).required('Selecciona el árbitro secundario'),
  arbitro3: Yup.object({
    id: Yup.string().required(),
    nombre: Yup.string().required(),
    apellidos: Yup.string().required(),
    correo: Yup.string().email().required(),
  }).required('Selecciona el árbitro de mesa'),
});

function getValidationSchema(step: number) {
  switch (step) {
    case 1:
      return esquemaPaso1;
    case 2:
      return esquemaPaso2;
    case 3:
      return esquemaPaso3;
    default:
      return null;
  }
}

interface PartidoFormProps {
  partido: Partido;
}

export default function EditarPartidoForm({ partido }: PartidoFormProps) {
  const { theme } = useTheme();
  const { temporada } = useTemporadaContext();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState('');
  const { arbitros } = useArbitros();

  const valoresIniciales = {
    fechaHora: partido.fecha ? new Date(partido.fecha) : new Date(),
    cancha: partido.cancha || '',
    arbitro1: partido.arbitro1 || null,
    arbitro2: partido.arbitro2 || null,
    arbitro3: partido.arbitro3 || null,
  };

  const totalSteps = 3;
  const esPasoFinal = step === totalSteps;

  const manejarEnvio = async (valores: typeof valoresIniciales) => {
    setIsLoading(true);
    setIsLoadingText('Actualizando partido');
    setError(null);
    try {
      if (!temporada) return;
      const cancha = pabellonesDisponibles.find(
        (pab) => pab.value === valores.cancha
      )?.label;
      if (!cancha) throw new Error('Pabellón no encontrado');

      const res = await partidoService.actualizarPartido(
        temporada.id,
        partido.tipoCompeticion,
        partido.id,
        {
          fecha: valores.fechaHora,
          cancha,
          arbitro1: valores.arbitro1,
          arbitro2: valores.arbitro2,
          arbitro3: valores.arbitro3,
        }
      );
      if (!res) throw new Error('Error al actualizar el partido');
      showToast('Partido actualizado correctamente', 'success');
      router.back();
    } catch (err: any) {
      showToast(err.message || 'Error al actualizar el partido', 'error');
      setError(err.message || 'Error al actualizar el partido');
    } finally {
      setIsLoading(false);
      setIsLoadingText('');
    }
  };

  const manejarSiguiente = async (
    formikProps: FormikProps<typeof valoresIniciales>
  ) => {
    const errors = await formikProps.validateForm();
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    } else {
      Object.keys(errors).forEach((campo) =>
        formikProps.setFieldTouched(campo, true)
      );
    }
  };

  const manejarAtras = () => {
    setStep(step - 1);
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
    <ScrollView
      style={[styles.contenedor, { backgroundColor: theme.background.primary }]}
    >
      {error && <StyledAlert variant='error' message={error} />}
      <Formik
        initialValues={valoresIniciales}
        validationSchema={getValidationSchema(step)}
        onSubmit={manejarEnvio}
      >
        {(formikProps: FormikProps<typeof valoresIniciales>) => {
          const { values, setFieldValue, errors, touched } = formikProps;

          return (
            <View
              style={[
                styles.formulario,
                { backgroundColor: theme.cardDefault },
              ]}
            >
              <View
                style={[
                  styles.indicadorPasos,
                  { borderBottomColor: theme.border.primary },
                ]}
              >
                <StyledText
                  style={[styles.textoPasos, { color: theme.text.primary }]}
                >
                  Paso {step} de {totalSteps}
                </StyledText>
              </View>
              {step === 1 && (
                <View style={styles.paso}>
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
                  {touched.fechaHora &&
                    typeof errors.fechaHora === 'string' && (
                      <StyledText style={styles.mensajeError}>
                        {errors.fechaHora}
                      </StyledText>
                    )}
                </View>
              )}
              {step === 2 && (
                <View style={styles.paso}>
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
                  {touched.cancha && errors.cancha && (
                    <StyledText style={styles.mensajeError}>
                      {errors.cancha}
                    </StyledText>
                  )}
                </View>
              )}
              {step === 3 && (
                <View style={styles.paso}>
                  <SelectorArbitro
                    arbitros={arbitros}
                    selected={{
                      arbitro1: values.arbitro1,
                      arbitro2: values.arbitro2,
                      arbitro3: values.arbitro3,
                    }}
                    onChange={(nuevo) => {
                      setFieldValue('arbitro1', nuevo.arbitro1);
                      setFieldValue('arbitro2', nuevo.arbitro2);
                      setFieldValue('arbitro3', nuevo.arbitro3);
                    }}
                  />
                  {touched.arbitro1 && errors.arbitro1 && (
                    <StyledText style={styles.mensajeError}>
                      {(errors.arbitro1 as any)?.id}
                    </StyledText>
                  )}
                  {touched.arbitro2 && errors.arbitro2 && (
                    <StyledText style={styles.mensajeError}>
                      {(errors.arbitro2 as any)?.id}
                    </StyledText>
                  )}
                  {touched.arbitro3 && errors.arbitro3 && (
                    <StyledText style={styles.mensajeError}>
                      {(errors.arbitro3 as any)?.id}
                    </StyledText>
                  )}
                </View>
              )}{' '}
              <View style={styles.contenedorBotones}>
                {step > 1 && (
                  <View style={styles.botonMitad}>
                    <StyledButton
                      variant='outline'
                      title='Atrás'
                      onPress={manejarAtras}
                      fullWidth
                    />
                  </View>
                )}
                <View style={styles.botonMitad}>
                  <StyledButton
                    variant='primary'
                    title={esPasoFinal ? 'Guardar' : 'Siguiente'}
                    onPress={
                      esPasoFinal
                        ? () => formikProps.submitForm()
                        : () => manejarSiguiente(formikProps)
                    }
                    fullWidth
                  />
                </View>
              </View>
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
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
  indicadorPasos: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  textoPasos: {
    fontSize: 14,
    textAlign: 'center',
  },
  paso: {
    marginBottom: 20,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  mensajeError: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  contenedorBotones: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    alignItems: 'center',
  },
  botonMitad: {
    flex: 1,
  },
});
