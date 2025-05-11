import * as ImageManipulator from 'expo-image-manipulator';

export async function compressImage(uri: string): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [], // no redimensionamos aquí, solo comprimimos
      {
        compress: 0.5, // rango 0 (máxima compresión) a 1 (sin compresión)
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return result.uri;
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
    return uri; // fallback sin compresión
  }
}
