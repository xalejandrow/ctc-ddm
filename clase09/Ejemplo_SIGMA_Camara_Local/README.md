# SIGMA Cámara Local

Ejemplo inicial para la aplicación SIGMA. Permite tomar una foto con la cámara del teléfono y guardarla dentro del almacenamiento local privado de la aplicación.

## Qué enseña este ejemplo

- Solicitar y comprobar el permiso de cámara.
- Mostrar la vista previa de la cámara con `CameraView`.
- Capturar una fotografía con `takePictureAsync`.
- Entender que la captura inicial queda en caché y es temporal.
- Copiar la foto a una carpeta persistente: `document/sigma-evidencias`.
- Leer las fotos locales y mostrarlas en una lista.
- Usar `SafeAreaProvider` y `SafeAreaView` desde `react-native-safe-area-context`.

## Tecnologías y versiones

Este ejemplo está preparado para **Expo SDK 58**:

- Expo `~58.0.22`
- React `19.3.0`
- React Native `0.88.1`
- `expo-camera` `~58.0.12`
- `expo-file-system` `~58.0.11`
- `react-native-safe-area-context` `~5.10.1`

> Si Expo publica correcciones de la misma versión, se puede ejecutar `npx expo install --fix` para alinear nuevamente las dependencias con SDK 58.

## Instalación

1. Descomprimir el proyecto y abrir una terminal dentro de la carpeta.

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar Expo:

```bash
npx expo start
```

4. Abrir el proyecto desde Expo Go, un emulador Android o un dispositivo iOS compatible.

> Para usar una cámara real, se recomienda un teléfono físico. Los emuladores pueden no tener una cámara disponible o devolver una imagen simulada.

## Uso de la aplicación

1. Abrir la aplicación.

2. Cuando se muestre el aviso, tocar **Permitir cámara**.

3. Apuntar la cámara hacia el elemento que se quiere registrar como evidencia.

4. Tocar **Tomar y guardar foto**.

5. La app toma la foto y la copia a la carpeta privada de documentos de SIGMA.

6. La nueva evidencia aparece en la sección **Evidencias locales** junto con su nombre, tamaño y URI local.

7. Cerrar y volver a abrir la app: las fotos continúan dentro de la carpeta local mientras no se desinstale la aplicación ni se borren sus datos.

## Permisos necesarios

### Cámara

La app solicita acceso a la cámara para tomar la evidencia fotográfica.

- **Android:** se declara `android.permission.CAMERA`.
- **iOS:** se declara `NSCameraUsageDescription`, con una explicación visible para la persona usuaria.

El permiso se solicita solamente cuando es necesario usar la cámara. Si se deniega, la app muestra una explicación y permite volver a pedirlo. Si el sistema ya no muestra el diálogo, la persona debe habilitarlo desde los ajustes del teléfono.

### No se solicita permiso de galería

Este ejemplo **no guarda la foto en la galería pública** del teléfono. La guarda en el espacio privado de documentos de la app, por lo que no requiere `expo-media-library` ni permiso de fotos/galería.

## Dónde se guarda la foto

El flujo es el siguiente:

1. `expo-camera` toma la foto y devuelve una URI temporal en la caché.
2. `expo-file-system` crea la carpeta `sigma-evidencias` dentro de `Paths.document`.
3. La app copia la foto desde la caché a esa carpeta.
4. La copia en `Paths.document` es la evidencia persistente local.

Esto es importante porque una foto que queda sólo en caché puede desaparecer cuando el sistema necesita espacio o la app se reinicia.

## Consideraciones para SIGMA en etapas posteriores

En una versión posterior se podría:

- Asociar la foto a una tarea, equipo o incidencia.
- Guardar fecha, técnico y ubicación GPS junto a la evidencia.
- Comprimir o redimensionar imágenes antes de enviarlas.
- Encolar las fotos para subirlas al backend cuando vuelva la conexión.
- Agregar la posibilidad de eliminar una evidencia local o enviarla manualmente.

## Estructura

```text
Ejemplo_SIGMA_Camara_Local/
├── App.tsx          # Pantalla y lógica principal
├── app.json         # Nombre de la app y mensajes/permisos nativos
├── package.json     # Dependencias compatibles con Expo SDK 58
├── tsconfig.json
└── README.md
```

## Referencias oficiales

- [Expo Camera](https://docs.expo.dev/versions/v58.0.0/sdk/camera/)
- [Expo FileSystem](https://docs.expo.dev/versions/v58.0.0/sdk/filesystem/)
- [Expo Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
