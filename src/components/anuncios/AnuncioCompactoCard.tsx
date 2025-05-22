'use client';

import type React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
  useColorScheme,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from 'react-native';
import { CloseCircleoIcon, MegaphoneIcon, PaperClipIcon } from '../Icons';
import { Anuncio } from '../../types/Anuncio';

interface AnuncioCompactoProps {
  anuncio: Anuncio;
}

const AnuncioCompactoCard: React.FC<AnuncioCompactoProps> = ({ anuncio }) => {
  const { titulo, contenido, imagenUrl, fechaPublicacion } = anuncio;
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Colores adaptados al tema
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';
  const textColor = isDark ? '#F9FAFB' : '#1F2937';
  const subtextColor = isDark ? '#9CA3AF' : '#6B7280';
  const iconColor = isDark ? '#9CA3AF' : '#4B5563';
  const modalBgColor = isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)';

  // Formatear fecha para mostrarla de manera amigable
  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <View style={[styles.card, { backgroundColor }]}>
        {/* Icono de megáfono */}
        <View style={styles.iconContainer}>
          <MegaphoneIcon size={20} color={iconColor} />
        </View>

        {/* Contenido principal */}
        <View style={styles.contentContainer}>
          <Text style={[styles.titulo, { color: textColor }]} numberOfLines={1}>
            {titulo}
          </Text>
          <Text
            style={[styles.contenido, { color: subtextColor }]}
            numberOfLines={2}
          >
            {contenido}
          </Text>
          <Text style={[styles.fecha, { color: subtextColor }]}>
            {formatearFecha(fechaPublicacion)}
          </Text>
        </View>

        {/* Icono de clip (solo si hay imagen) */}
        {imagenUrl && (
          <TouchableOpacity
            style={styles.clipContainer}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <PaperClipIcon size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal para mostrar la imagen a pantalla completa */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StatusBar backgroundColor='black' barStyle='light-content' />
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={[styles.modalContainer, { backgroundColor: modalBgColor }]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {imagenUrl && (
                  <Image
                    source={{ uri: imagenUrl }}
                    style={styles.fullImage}
                    resizeMode='contain'
                  />
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <CloseCircleoIcon size={24} color='#FFFFFF' />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 6,
    marginHorizontal: 2,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  contenido: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  fecha: {
    fontSize: 11,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  clipContainer: {
    padding: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
});

export default AnuncioCompactoCard;
