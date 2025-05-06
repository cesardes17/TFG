// src/api/config/firebase.ts
import { Platform } from 'react-native';

// Unified exports for Auth, Firestore, Storage, and Realtime Database
let auth: any, firestore: any, storage: any, database: any;

if (Platform.OS === 'web') {
  const web = require('./firebase.web');
  auth = web.auth;
  firestore = web.firestore;
  storage = web.storage;
  database = web.database;
} else {
  const native = require('./firebase.native');
  auth = native.auth();
  firestore = native.firestore();
  storage = native.storage();
  database = native.database();
}

export { auth, firestore, storage, database };
