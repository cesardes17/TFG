// src/api/config/firebase.native.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

// Export RNFirebase instances for iOS and Android
export { auth, firestore, storage, database };
