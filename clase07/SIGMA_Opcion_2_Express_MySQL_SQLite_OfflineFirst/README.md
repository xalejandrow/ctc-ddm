# SIGMA Opcion 2 - Express MySQL SQLite Offline First

Ejemplo didactico de una aplicacion **offline-first** para SIGMA - Mantenimiento. La app puede crear, finalizar y eliminar tareas sin Internet. Cada cambio se guarda primero en SQLite y luego se agrega a una cola local. Cuando se recupera la conectividad, el celular envia la cola al backend Express, que la persiste en MySQL.

> Alcance de clase: no incluye login, usuarios, fotos ni GPS. Esos modulos se agregan sobre la misma base cuando ya se entiende el flujo local -> cola -> API -> MySQL.

## Arquitectura

```text
React Native + Expo 57
        |
        +-- SQLite: tasks + sync_queue (funciona sin red)
        |
        +-- NetInfo detecta conectividad
        |
        +-- POST /api/sync
                  |
             Node.js + Express
                  |
                MySQL
```

SQLite conserva la copia de trabajo local. `sync_queue` registra cada operacion `CREATE`, `UPDATE` o `DELETE`. MySQL es la base central compartida. La sincronizacion se realiza manualmente con el boton de la app para que el flujo sea visible durante la clase.

## Requisitos

- Node.js 20 o superior.
- Docker Desktop recomendado para iniciar MySQL. Alternativamente se puede usar una instancia MySQL local.
- Expo Go en el telefono o un emulador Android/iOS.

## 1. Iniciar MySQL y el backend

Desde esta carpeta raiz ejecutar:

```bash
docker compose up --build
```

Esto crea:

- MySQL en `localhost:3307`.
- API Express en `http://localhost:4000`.

Comprobar que esta disponible:

```bash
curl http://localhost:4000/api/health
```

Respuesta esperada:

```json
{ "status": "ok", "database": "mysql" }
```

Para detener los servicios:

```bash
docker compose down
```

Los datos quedan en el volumen Docker `mysql_data`. Para borrarlos y recrear todo desde cero:

```bash
docker compose down -v
```

### Ejecutar el backend sin Docker

1. Crear una base MySQL llamada `sigma` y ejecutar `backend/database/init.sql`.
2. Copiar `backend/.env.example` como `backend/.env` y ajustar los valores.
3. Ejecutar:

```bash
cd backend
npm install
npm run dev
```

## 2. Ejecutar la app Expo

En otra terminal:

```bash
cd mobile
npm install
npx expo start
```

Escanear el QR con Expo Go, o presionar `a` / `i` para usar un emulador.

### Configurar la URL de la API

Editar `mobile/src/config.ts` antes de probar en un telefono fisico.

| Donde se ejecuta la app | Valor de `API_URL` |
| --- | --- |
| Telefono fisico | `http://IP_DE_TU_COMPUTADORA:4000/api` |
| Emulador Android | `http://10.0.2.2:4000/api` |
| Simulador iOS | `http://localhost:4000/api` |

El telefono y la computadora deben estar en la misma red Wi-Fi. No usar `localhost` en un telefono fisico: alli `localhost` es el propio telefono.

## Prueba guiada de offline-first

1. Iniciar Docker y abrir la app.
2. Crear una tarea y presionar **Sincronizar ahora**. Queda como `SINCRONIZADA`.
3. Desactivar Wi-Fi y datos moviles del telefono.
4. Crear otra tarea, finalizarla o eliminarla. La app sigue funcionando y muestra `PENDIENTE`.
5. Volver a conectar el telefono.
6. Presionar **Sincronizar ahora**. Las operaciones pendientes viajan al servidor y los estados cambian a `SINCRONIZADA`.
7. Consultar los datos centrales con `GET http://localhost:4000/api/tasks`.

## Estructura

```text
backend/
  src/server.js              API Express y logica de sincronizacion
  database/init.sql          Tablas y datos iniciales MySQL
mobile/
  App.tsx                    Interfaz de tareas SIGMA
  src/database.ts            SQLite, tareas y cola durable
  src/sync.ts                Envio de cola y descarga de datos centrales
  src/config.ts              URL de la API
```

## Rutas de la API

| Metodo | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/health` | Verificar que Express y MySQL respondan |
| GET | `/api/tasks` | Listar tareas activas y eliminadas |
| POST | `/api/tasks` | Crear una tarea desde una herramienta externa |
| PATCH | `/api/tasks/:id` | Actualizar una tarea |
| DELETE | `/api/tasks/:id` | Eliminacion logica |
| POST | `/api/sync` | Enviar operaciones pendientes desde el celular |

## Decisiones simplificadas para este ejemplo

- Express y `mysql2` en lugar de NestJS y un ORM: se ven las consultas SQL y las rutas HTTP sin abstracciones adicionales.
- Identificadores UUID generados por el celular: permiten crear registros sin esperar respuesta del servidor.
- Eliminacion logica: el servidor conserva el registro con `deleted_at`, para que la eliminacion tambien se pueda sincronizar.
- Conflictos: la fecha `updated_at` mas reciente prevalece. En un producto real se agregarian versiones, usuario, auditoria y resolucion de conflictos.
- La app no sube fotos ni coordenadas todavia. Para fotos se agregaria una cola de archivos y almacenamiento de objetos; para GPS, campos de latitud/longitud y permisos del dispositivo.

## Dependencias principales

### Backend

- `express`: rutas HTTP y middleware.
- `mysql2`: conexion y consultas parametrizadas a MySQL.
- `cors`: permite que la app movil consulte la API durante desarrollo.
- `dotenv`: variables de entorno.

### App movil

- `expo-sqlite`: base SQLite en el telefono.
- `@react-native-community/netinfo`: estado de conectividad.
- `axios`: cliente HTTP.

La configuracion movil usa Expo 57, React 19.2.3 y React Native 0.86.3, segun la configuracion definida para los ejemplos de la materia.
