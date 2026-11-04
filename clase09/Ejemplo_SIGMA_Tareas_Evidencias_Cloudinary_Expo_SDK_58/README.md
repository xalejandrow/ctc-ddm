# SIGMA: tareas con evidencias fotográficas en Cloudinary

Ejemplo didáctico con Expo SDK 58, Express, MySQL y Cloudinary. Parte del CRUD de tareas con roles y permite registrar una foto de evidencia con una descripción. La aplicación móvil usa `fetch` directamente: no hay `apiFetch` ni otra capa que oculte el recorrido de una petición.

## Qué resuelve

1. El usuario inicia sesión y obtiene un JWT.
2. Un supervisor puede ver evidencias de todas las tareas; un técnico solo de sus propias tareas asignadas.
3. Desde una tarea se abre **Ver evidencias** y se toma una foto.
4. La app crea un `FormData` con `description` y `photo` y lo envía con `fetch` a Express.
5. Express valida JWT, rol, tarea, descripción, tipo y tamaño del archivo.
6. El backend sube el buffer a Cloudinary.
7. MySQL guarda la URL segura de la imagen, la descripción, el `public_id` de Cloudinary, la tarea, el usuario y la fecha.

```text
Cámara → FormData / fetch → Express + multer → Cloudinary
                                ↓
                           MySQL: URL + descripción + relación con tarea
```

## Reglas de negocio

| Acción | Supervisor | Técnico |
|---|---:|---:|
| Ver tareas | Todas | Libres y propias |
| Crear, asignar o eliminar tarea | Sí | No |
| Registrar y ver evidencia | Cualquier tarea | Solo tarea propia |
| Tamaño de imagen | 6 MB máximo | 6 MB máximo |
| Formatos aceptados | JPG, PNG, WEBP | JPG, PNG, WEBP |

## 1. Configurar Cloudinary

1. Crear una cuenta en [Cloudinary](https://cloudinary.com/).
2. En el panel principal, copiar **Cloud name**, **API Key** y **API Secret**.
3. En `backend`, copiar el archivo de ejemplo:

   ```bash
   cp .env.example .env
   ```

4. Completar en `.env` las tres variables de Cloudinary:

   ```env
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

`API_SECRET` es una credencial de servidor: nunca debe ir en la app Expo, en Git, ni en una captura de pantalla. Este ejemplo la usa únicamente en Express.

Las imágenes quedarán organizadas en Cloudinary bajo `sigma-tareas/tarea-{id}`. En el plan y la configuración básica de Cloudinary, las URLs de entrega suelen ser públicas: no se deben usar para evidencias sensibles o con datos personales sin definir una política de acceso apropiada.

## 2. Ejecutar MySQL

Desde la carpeta raíz:

```bash
docker compose up -d
```

La primera ejecución crea las tablas, incluidos `task_evidences` y los usuarios de prueba. Para reiniciar los datos:

```bash
docker compose down -v
docker compose up -d
```

## 3. Ejecutar el backend

```bash
cd backend
cp .env.example .env
# Editar .env y completar las credenciales de Cloudinary
npm install
npm run dev
```

Comprobar en `http://localhost:4000/health`.

## 4. Ejecutar la app Expo

```bash
cd app
npm install
npx expo start
```

Editar `app/src/config/api.ts` según dónde se ejecute la app:

| Entorno | `API_URL` |
|---|---|
| Android Emulator | `http://10.0.2.2:4000` |
| iOS Simulator | `http://localhost:4000` |
| Celular físico | `http://IP_LOCAL_DE_TU_PC:4000` |

Para un celular físico, el teléfono y la computadora deben usar la misma red. No usar `localhost`: desde el teléfono, `localhost` es el propio teléfono.

## Permisos de la app

La aplicación solicita únicamente el permiso de **cámara**, justo antes de abrirla. No pide acceso a galería porque la foto se toma en el momento y se sube al servidor.

La justificación visible en el sistema se define en `app/app.json`. Luego de cambiar ese archivo, crear un nuevo build nativo o reinstalar la app de desarrollo. En Expo Go, el permiso se solicita en tiempo de ejecución al presionar **Abrir cámara**.

Si el usuario niega el permiso, la app explica que no puede registrar la evidencia. Puede habilitarlo luego desde los ajustes del sistema operativo.

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| `supervisor@sigma.test` | `123456` | SUPERVISOR |
| `tecnico@sigma.test` | `123456` | TECNICO |

## Recorrido de clase sugerido

1. Iniciar como supervisor y abrir una tarea asignada al técnico.
2. Elegir **Ver evidencias**, escribir una descripción, abrir la cámara y tomar una foto.
3. Presionar **Guardar evidencia** y verificar que aparece en el listado.
4. Abrir Cloudinary: verificar la carpeta de la tarea y comparar la URL con el registro de MySQL.
5. Iniciar como técnico. Tomar una tarea libre y recién entonces registrar su evidencia.
6. Intentar abrir una tarea que no pertenece al técnico mediante una petición manual: la API debe responder `403`.

## Los `fetch` importantes

### Login: JSON

`AuthContext` envía correo y contraseña como JSON y recibe el token. Ese token se guarda con `expo-secure-store` y se agrega en las siguientes solicitudes como `Authorization: Bearer ...`.

```ts
await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

### Foto: multipart/form-data

La pantalla `EvidenceScreen` no fija manualmente el encabezado `Content-Type`. `fetch` agrega el límite multipart correcto al recibir un `FormData`.

```ts
const formData = new FormData();
formData.append('description', description.trim());
formData.append('photo', { uri: photoUri, name: 'evidencia.jpg', type: 'image/jpeg' } as any);

await fetch(`${API_URL}/tasks/${task.id}/evidences`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

El backend usa `multer.memoryStorage()` para leer el archivo recibido como buffer. Luego `cloudinary.uploader.upload_stream()` lo envía a Cloudinary, y finalmente inserta el enlace y la descripción en la tabla `task_evidences`.

## Rutas nuevas

| Método | Ruta | Uso |
|---|---|---|
| GET | `/tasks/:id/evidences` | Lista el registro de fotos de una tarea |
| POST | `/tasks/:id/evidences` | Recibe `multipart/form-data` con `description` y `photo` |

## Estructura relevante

```text
backend/src/config/cloudinary.js      configuración y stream de subida
backend/src/routes/tasks.routes.js    autorización, multer, Cloudinary y MySQL
backend/database/schema.sql           tabla task_evidences
app/src/screens/EvidenceScreen.tsx    cámara, FormData y fetch
app/src/context/AuthContext.tsx       fetch de login y sesión
```

## Consideraciones para producción

- Validar además dimensiones y contenido real de la imagen; el MIME por sí solo no es una garantía suficiente.
- Usar credenciales y JWT robustos, HTTPS y variables de entorno administradas.
- Definir retención y eliminación: este ejemplo guarda el `cloudinary_public_id` para poder eliminar después el recurso remoto de manera controlada.
- Revisar privacidad y acceso antes de almacenar evidencias con información sensible.
