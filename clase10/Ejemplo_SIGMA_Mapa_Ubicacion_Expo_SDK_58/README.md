# SIGMA - Mapa y ubicación real

Ejemplo básico para aprender el flujo: permiso → GPS → precisión → mapa → selección de ubicación.

## Qué incluye

- Mapa centrado inicialmente en Colonia.
- Botón para pedir ubicación solo cuando el usuario lo solicita.
- Marcador verde si la precisión es de 50 m o menos.
- Marcador naranja y aviso si la precisión es mayor a 50 m.
- Mensaje cuando el GPS está apagado o no hay señal suficiente.
- Acceso a Ajustes si el permiso fue bloqueado permanentemente.
- Botón **Usar esta ubicación** habilitado únicamente con precisión aceptable.

## Instalación

```bash
npm install
cp .env.example .env
npx expo start
```

Para instalar siempre las versiones compatibles con el SDK activo, también se puede ejecutar:

```bash
npx expo install expo-location react-native-maps
```

## Google Maps

1. Crear un proyecto con facturación en Google Cloud.
2. Habilitar **Maps SDK for Android**. Para iOS, habilitar también **Maps SDK for iOS**.
3. Crear una API key por plataforma.
4. Restringir Android por `android.package` y SHA-1. Restringir iOS por Bundle ID.
5. Copiar las claves al archivo `.env`.

Después de agregar las claves o cambiar `app.config.js`, crear un build nativo:

```bash
npx expo run:android
```

o:

```bash
eas build --profile development --platform android
```

Expo Go permite probar el mapa, pero las claves configuradas con el plugin se aplican en un development build o en la versión final de la aplicación.

## Pruebas sugeridas

1. Probar al aire libre: debería aparecer una precisión baja y habilitarse **Usar esta ubicación**.
2. Probar dentro de un salón: puede aparecer una precisión alta y se debe reintentar.
3. Denegar permiso y volver a presionar el botón.
4. Bloquear el permiso desde el sistema y verificar el botón **Abrir Ajustes**.

## No incluye todavía

- Backend ni base de datos.
- Persistencia de incidencias.
- Búsqueda de direcciones, rutas o lugares cercanos.

El siguiente paso será enviar `latitude`, `longitude`, `accuracy` y `capturedAt` junto con una incidencia SIGMA al backend.
