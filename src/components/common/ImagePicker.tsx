import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { compressImage } from '../../utils/imageCompressor';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  placeholder?: string;
}

export default function ImagePicker({
  onImageSelected,
  placeholder,
}: ImagePickerProps) {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la galería');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // opcional, porque también vamos a comprimir después
    });

    if (!result.canceled && result.assets[0].uri) {
      const originalUri = result.assets[0].uri;
      const compressedUri = await compressImage(originalUri);

      setImage(compressedUri); // Mostramos imagen comprimida
      onImageSelected(compressedUri); // Enviamos la comprimida al padre
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.imageContainer,
          { borderColor: theme.border.primary },
          image ? styles.imageSelected : null,
        ]}
        onPress={pickImage}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Icon name='camera-plus' size={40} color={theme.icon.active} />
            <StyledText
              style={[styles.placeholder, { color: theme.text.secondary }]}
            >
              {placeholder || 'Seleccionar imagen'}
            </StyledText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSelected: {
    padding: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    marginTop: 8,
    textAlign: 'center',
  },
});
