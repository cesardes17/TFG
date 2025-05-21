import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import ImagePicker from '../../common/ImagePicker';
import StyledAlert from '../../common/StyledAlert';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTemporadaContext } from '../../../contexts/TemporadaContext';
import { useToast } from '../../../contexts/ToastContext';
import { useUser } from '../../../contexts/UserContext';
import { getRandomUID } from '../../../utils/getRandomUID';
import { router } from 'expo-router';
import { Anuncio } from '../../../types/Anuncio';
import { anunciosService } from '../../../services/anunciosService';
import LoadingIndicator from '../../common/LoadingIndicator';

interface FormValues {
  titulo: string;
  contenido: string;
  imagen?: string;
}

export default function NuevoAnuncioForm() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { temporada } = useTemporadaContext();
  const { user } = useUser();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: FormValues = {
    titulo: '',
    contenido: '',
    imagen: '',
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const anuncio: Anuncio = {
        id: getRandomUID(),
        titulo: values.titulo,
        contenido: values.contenido,
        fechaPublicacion: new Date(),
        autor: {
          id: user!.uid,
          nombre: user!.nombre,
          apellidos: user!.apellidos,
          correo: user!.correo,
        },
        imagenUrl: values.imagen || '',
      };

      const res = await anunciosService.crearAnuncio(
        temporada!.id,
        anuncio.id,
        anuncio
      );

      if (!res.success)
        throw new Error(res.errorMessage || 'Error creando el anuncio');

      showToast('Anuncio publicado', 'success');
      router.back();
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
    console.log(values);
  };

  if (isLoading) {
    return <LoadingIndicator text='Cargando ...' />;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ handleSubmit, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <StyledText style={[styles.title, { color: theme.text.primary }]}>
            Nuevo anuncio
          </StyledText>

          {error && <StyledAlert message={error} variant='error' />}

          <InputFormik name='titulo' placeholder='Título del anuncio' />
          <InputFormik
            name='contenido'
            placeholder='Contenido del anuncio'
            multiline
            numberOfLines={4}
          />
          <ImagePicker
            placeholder='Selecciona imagen (opcional)'
            onImageSelected={(uri) => setFieldValue('imagen', uri)}
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.button.primary.background },
            ]}
            onPress={() => {
              handleSubmit();
            }}
          >
            <StyledText style={{ color: theme.button.primary.text }}>
              Publicar
            </StyledText>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
