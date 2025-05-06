// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  scheme: 'glmba',
  entryPoint: 'node_modules/expo-router/entry',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    backgroundColor: '#ffffff',
    resizeMode: 'contain',
  },
  extra: {
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL, // <-- ahora correcto
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.cesardelgado.glmba',
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    ...config.android,
    package: 'com.cesardelgado.glmba',
    googleServicesFile: './google-services.json',
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: 'metro',
  },
  plugins: [
    '@react-native-firebase/app',
    ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
    'expo-router',
  ],
});
