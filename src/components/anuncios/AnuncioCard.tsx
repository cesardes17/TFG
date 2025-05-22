import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { MegaphoneIcon } from '../Icons';
import { Anuncio } from '../../types/Anuncio';
import ProgressiveImage from '../common/ProgressiveImage';

// Definición de tipos para las props
interface AnuncioCardProps {
  anuncio: Anuncio;
}

const AnuncioCard: React.FC<AnuncioCardProps> = ({ anuncio }) => {
  const { titulo, contenido, imagenUrl, fechaPublicacion } = anuncio;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Colores adaptados al tema
  const backgroundColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const textColor = isDarkMode ? '#F9FAFB' : '#1F2937';
  const subtextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const shadowColor = isDarkMode ? '#000000' : '#000000';

  // Formatear fecha para mostrarla de manera amigable
  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={[styles.card, { backgroundColor, shadowColor }]}>
      {/* Header con icono */}
      <View style={styles.header}>
        <MegaphoneIcon size={20} color={subtextColor} />
        <Text style={[styles.titulo, { color: textColor }]}>{titulo}</Text>
      </View>

      {/* Imagen (si existe) */}
      {imagenUrl && (
        <ProgressiveImage
          uri={imagenUrl}
          style={styles.imagen}
          resizeMode='cover'
        />
      )}

      {/* Contenido */}
      <View style={styles.contenidoContainer}>
        <Text style={[styles.contenido, { color: textColor }]}>
          {contenido}
        </Text>
      </View>

      {/* Fecha de publicación */}
      <Text style={[styles.fecha, { color: subtextColor }]}>
        {formatearFecha(fechaPublicacion)}
      </Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  imagen: {
    width: '100%',
    height: width * 0.5, // Altura proporcional al ancho de la pantalla
  },
  contenidoContainer: {
    padding: 16,
    paddingTop: 12,
  },
  contenido: {
    fontSize: 14,
    lineHeight: 20,
  },
  fecha: {
    fontSize: 12,
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontStyle: 'italic',
  },
});

export default AnuncioCard;
