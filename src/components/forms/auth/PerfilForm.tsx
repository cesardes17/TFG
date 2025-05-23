'use client';

import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import SelectableCardGroup, { Option } from '../../common/SelectableCardGroup';
import { posiciones } from '../../../constants/posiciones';
import StyledButton from '../../common/StyledButton';
import ImagePicker from '../../common/ImagePicker';
import { Rol } from '../../../types/User';
import { useTheme } from '../../../contexts/ThemeContext';

export interface ValoresFormulario {
  nombre: string;
  apellidos: string;
  rol: 'jugador' | 'espectador';
  altura: string;
  peso: string;
  dorsalPreferido: string;
  posicionPreferida: string;
  imagenPerfil: string;
  imagenExistente: boolean; // 👈 Agregado para saber si hay una imagen existente
}

const esquemaInformacionBasica = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellidos: Yup.string().required('Los apellidos son obligatorios'),
});

const esquemaSeleccionRol = Yup.object().shape({
  rol: Yup.string()
    .oneOf(['jugador', 'espectador'], 'Debes seleccionar un rol')
    .required('El rol es obligatorio'),
});

const esquemaInformacionJugador = Yup.object().shape({
  altura: Yup.number()
    .required('La altura es obligatoria')
    .positive('La altura debe ser positiva'),
  peso: Yup.number()
    .required('El peso es obligatorio')
    .positive('El peso debe ser positivo'),
  dorsalPreferido: Yup.number()
    .required('El dorsal preferido es obligatorio')
    .positive('El dorsal debe ser positivo')
    .integer('El dorsal debe ser un número entero'),
});

const esquemaPosicionFavorita = Yup.object().shape({
  posicionPreferida: Yup.string().required(
    'La posición preferida es obligatoria'
  ),
});

const esquemaImagenPerfil = Yup.object().shape({
  imagenPerfil: Yup.string().when(['rol', 'imagenExistente'], {
    is: (rol: Rol, imagenExistente: boolean) =>
      rol === 'jugador' && !imagenExistente,
    then: (schema) =>
      schema.required('La imagen es obligatoria para los jugadores'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

function getValidationSchema(paso: number) {
  switch (paso) {
    case 1:
      return esquemaInformacionBasica;
    case 2:
      return esquemaSeleccionRol;
    case 3:
      return esquemaInformacionJugador;
    case 4:
      return esquemaPosicionFavorita;
    case 5:
      return esquemaImagenPerfil; // 👈
    default:
      return null;
  }
}

const opcionesRol: Option<'jugador' | 'espectador'>[] = [
  {
    label: 'Espectador',
    description: 'Solo visualiza la información',
    value: 'espectador',
  },
  {
    label: 'Jugador',
    description: 'Participa en la competición',
    value: 'jugador',
  },
];

interface EditarPerfilFormProps {
  setIsLoading: (isLoading: boolean) => void;
  setLoadingText: (text: string) => void;
  valoresIniciales: ValoresFormulario;
  onSubmit: (valores: ValoresFormulario) => void;
}

export default function PerfilForm({
  setIsLoading,
  setLoadingText,
  valoresIniciales,
  onSubmit,
}: EditarPerfilFormProps) {
  const { theme } = useTheme();
  const [pasoActual, setPasoActual] = useState(1);

  const obtenerTotalPasos = (valores: ValoresFormulario) => {
    return valores.rol === 'jugador' ? 5 : 2;
  };

  const manejarSiguiente = async (
    formikProps: FormikProps<ValoresFormulario>
  ) => {
    const errors = await formikProps.validateForm();
    if (Object.keys(errors).length === 0) {
      const { values } = formikProps;
      if (pasoActual === 2 && values.rol === 'espectador') {
        setPasoActual(obtenerTotalPasos(values));
      } else {
        setPasoActual(pasoActual + 1);
      }
    } else {
      Object.keys(errors).forEach((campo) =>
        formikProps.setFieldTouched(campo, true)
      );
    }
  };

  const manejarEnvio = (valores: ValoresFormulario) => {
    console.log('🚨 Guardando cambios...'); // Asegúrate de tener esta línea
    onSubmit(valores);
  };

  const manejarAtras = () => {
    setPasoActual(pasoActual - 1);
  };

  const renderizarPaso = (formikProps: FormikProps<ValoresFormulario>) => {
    const { values, setFieldValue, errors, touched } = formikProps;

    switch (pasoActual) {
      case 1:
        return (
          <View style={styles.paso}>
            <StyledText style={styles.tituloPaso}>
              Información Básica
            </StyledText>
            <InputFormik name='nombre' placeholder='Ingresa tu nombre' />
            <InputFormik name='apellidos' placeholder='Ingresa tus apellidos' />
          </View>
        );

      case 2:
        return (
          <View style={styles.paso}>
            <StyledText style={styles.tituloPaso}>Selección de Rol</StyledText>
            <SelectableCardGroup
              options={opcionesRol}
              value={values.rol}
              onChange={(valor) => setFieldValue('rol', valor)}
            />
            {touched.rol && errors.rol && (
              <StyledText
                style={[styles.mensajeError, { color: theme.text.error }]}
              >
                {errors.rol}
              </StyledText>
            )}
          </View>
        );

      case 3:
        return (
          <View style={styles.paso}>
            <StyledText style={styles.tituloPaso}>
              Información del Jugador
            </StyledText>
            <InputFormik
              name='altura'
              placeholder='Ingresa tu altura en cm'
              keyboardType='numeric'
            />

            <InputFormik
              name='peso'
              placeholder='Ingresa tu peso en kg'
              keyboardType='numeric'
            />

            <InputFormik
              name='dorsalPreferido'
              placeholder='Ingresa tu dorsal preferido'
              keyboardType='numeric'
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.paso}>
            <StyledText style={styles.tituloPaso}>Posición Favorita</StyledText>
            <SelectableCardGroup
              options={posiciones}
              value={values.posicionPreferida}
              onChange={(valor) => setFieldValue('posicionPreferida', valor)}
            />
            {touched.posicionPreferida && errors.posicionPreferida && (
              <StyledText
                style={[styles.mensajeError, { color: theme.text.error }]}
              >
                {errors.posicionPreferida}
              </StyledText>
            )}
          </View>
        );

      case 5:
        return (
          <View style={styles.paso}>
            <StyledText style={styles.tituloPaso}>
              Imagen de Perfil {!values.imagenExistente && '(Obligatorio)'}
            </StyledText>
            <ImagePicker
              onImageSelected={(uri) => {
                setFieldValue('imagenPerfil', uri); // ✅ Guardar en Formik
              }}
              placeholder='Seleccionar Imagen'
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={[styles.contenedor, { backgroundColor: theme.background.primary }]}
    >
      <Formik
        initialValues={valoresIniciales}
        validationSchema={getValidationSchema(pasoActual)}
        onSubmit={manejarEnvio}
      >
        {(formikProps: FormikProps<ValoresFormulario>) => {
          const totalPasos = obtenerTotalPasos(formikProps.values);
          const esPasoFinal = pasoActual === totalPasos;

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
                  style={[styles.textoPasos, { color: theme.text.secondary }]}
                >
                  Paso {pasoActual} de {totalPasos}
                </StyledText>
              </View>

              {renderizarPaso(formikProps)}

              <View style={styles.contenedorBotones}>
                {pasoActual > 1 && (
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
  tituloPaso: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mensajeError: {
    fontSize: 12,
    marginTop: 4,
  },
  campoFormulario: {
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },

  contenedorBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    maxWidth: 400, // o un valor que te acomode
    alignSelf: 'center',
    gap: 10,
  },
  botonMitad: {
    flex: 1,
  },
  contenedorTarjetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tarjetaSeleccion: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
  },
  tarjetaSeleccionada: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  textoTarjeta: {
    fontSize: 16,
    fontWeight: '500',
  },
  botonSeleccionarImagen: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBoton: {
    color: '#333',
    fontWeight: '500',
  },
  contenedorVistaPrevia: {
    alignItems: 'center',
    marginTop: 8,
  },
  vistaPrevia: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 8,
  },
  botonEliminar: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 4,
  },
  textoBotonEliminar: {
    color: '#f44336',
  },
});
