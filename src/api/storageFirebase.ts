// src/api/storageFirebase.ts
import { Platform } from 'react-native';
import storageNative, {
  FirebaseStorageTypes,
} from '@react-native-firebase/storage';

let webStorage: import('firebase/storage').FirebaseStorage;
// Native: storageNative is a function that returns the FirebaseStorage instance
let nativeStorage: () => FirebaseStorageTypes.Module;

if (Platform.OS === 'web') {
  webStorage = require('./config/firebase')
    .storage as import('firebase/storage').FirebaseStorage;
} else {
  nativeStorage = storageNative;
}

/**
 * Uploads a file blob or file path to Firebase Storage at the given path.
 * @param path - Storage path where to upload (e.g. 'profiles/uid.jpg')
 * @param file - On web a Blob or File, on native a local file path string
 * @returns download URL
 */
export async function uploadFileFS(
  path: string,
  file: Blob | File | string
): Promise<string> {
  if (Platform.OS === 'web') {
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import(
      'firebase/storage'
    );
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file as Blob | Uint8Array);
    return getDownloadURL(storageRef);
  } else {
    // Native
    const storage = nativeStorage();
    const refNative = storage.ref(path);
    await refNative.putFile(file as string);
    return refNative.getDownloadURL();
  }
}

/**
 * Deletes a file at the given storage path.
 */
export async function deleteFileFS(path: string): Promise<void> {
  if (Platform.OS === 'web') {
    const { getStorage, ref, deleteObject } = await import('firebase/storage');
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } else {
    const storage = nativeStorage();
    const refNative = storage.ref(path);
    await refNative.delete();
  }
}
