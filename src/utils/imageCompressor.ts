import * as ImageManipulator from 'expo-image-manipulator';

export async function compressImage(uri: string): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }], // ← usa al menos una acción, nunca []
      {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return result.uri;
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
    return uri; // fallback sin compresión
  }
}
