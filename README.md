# Aplicación Multiplataforma para la Gestión y Seguimiento de una Liga de Baloncesto – Guía de Instalación y Desarrollo Local

Bienvenido/a al repositorio de la app de gestión de liga deportiva. Aquí encontrarás los pasos necesarios para levantar el entorno en local, tanto para web como para dispositivos Android e iOS, utilizando tu propia cuenta y proyecto de Firebase.

## Requisitos previos

* Node.js (recomendado: versión 18+)
* Yarn o npm (recomendado: Yarn)
* Git
* Expo CLI (`npm install -g expo-cli`)
* Cuenta de Firebase ([https://firebase.google.com](https://firebase.google.com))
* (Opcional) Android Studio y/o Xcode para probar en emuladores físicos o virtuales

## 1. Clona este repositorio

```bash
git clone https://github.com/tuusuario/ligadeportiva-app.git
cd ligadeportiva-app
```

## 2. Crea tu propio proyecto de Firebase

1. Accede a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en "Agregar proyecto" y sigue los pasos (elige el nombre que prefieras).
3. En el panel del proyecto, ve a Authentication y habilita el método de correo y contraseña.
4. Habilita también Cloud Firestore, Realtime Database y Cloud Storage (en modo de prueba para desarrollo).
5. Crea 3 aplicaciones dentro del mismo proyecto de Firebase:

   * Una para Web
   * Una para Android
   * Una para iOS

### Web

* Al crear la app Web, Firebase te mostrará las claves de configuración (`apiKey`, `projectId`, etc.).

### Android

* Al registrar la app Android, Firebase te pedirá el nombre del paquete.
* Descarga el archivo `google-services.json` que se genera.
* Coloca este archivo en la **raíz del proyecto**.

### iOS

* Al registrar la app iOS, Firebase te pedirá el Bundle ID.
* Descarga el archivo `GoogleService-Info.plist` que se genera.
* Coloca este archivo en la **raíz del proyecto.

## 3. Configura las credenciales en tu proyecto local

* Para Web, copia los datos de configuración de Firebase en los archivos de entorno de tu proyecto (o en el archivo de configuración indicado, normalmente `src/config/firebaseConfig.ts` o `.env`).

Ejemplo para `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=xxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxx
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxxx
```

Importante:
Debes configurar las credenciales para Web usando variables de entorno o archivos de configuración.
Para Android y iOS, debes colocar los archivos descargados (`google-services.json` y `GoogleService-Info.plist`) en la raíz del proyecto para que Expo y React Native Firebase los detecten automáticamente durante el prebuild.

## 4. Instala las dependencias

```bash
yarn install
# o
npm install
```

## 5. Prebuild para ejecutar en emulador Android/iOS

Antes de probar en un emulador o dispositivo físico (Android o iOS), ejecuta:

```bash
npx expo prebuild
```

Esto genera los proyectos nativos necesarios.
Nota: Si omites este paso y pruebas en Android/iOS, obtendrás errores críticos de compilación.

## 6. Ejecutar la app

### Web

```bash
npx expo start
```

En la consola pulsa "w" para abrir la app en el navegador.
(No es necesario hacer prebuild para web)

### Android

```bash
npx expo run:android
```

Asegúrate de tener un emulador o dispositivo conectado.

### iOS

```bash
npx expo run:ios
```

(Solo disponible en macOS con Xcode instalado)

## 7. Primer inicio de sesión y asignación de rol

1. Regístrate como un nuevo usuario desde la propia app.
2. Accede a Firebase Console > Firestore Database ([https://console.firebase.google.com/](https://console.firebase.google.com/)) y busca tu usuario recién creado.
3. Modifica manualmente el campo rol del documento de usuario y asígnale el valor 'organizador'.
4. A partir de ese momento, tendrás acceso total como organizador y podrás comenzar a usar todas las funcionalidades de la app.

## 8. Notas adicionales

* Los servicios de Firestore, Storage, Auth y Realtime Database ya estarán listos para usarse con la configuración anterior.
* Se recomienda trabajar siempre en modo de prueba durante el desarrollo. Para producción, configura las reglas de seguridad adecuadas.
