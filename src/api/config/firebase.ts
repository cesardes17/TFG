import { Platform } from 'react-native';

// Selecciona la implementación adecuada
let auth: any;
let firestore: any;
let storage: any;
let database: any;

if (Platform.OS === 'web') {
  const web = require('./firebase.web');
  auth = web.auth;
  firestore = web.firestore;
  storage = web.storage;
  database = web.database;
} else {
  const native = require('./firebase.native');
  auth = native.auth;
  firestore = native.firestore;
  storage = native.storage;
  database = native.database;
}

export { auth, firestore, storage, database };
