# SIGMA: CRUD de tareas con roles

Ejemplo completo con Expo, Express y MySQL. No utiliza offline-first: toda la información se consulta y se actualiza directamente contra la API.

## Reglas de negocio implementadas

| Acción | Supervisor | Técnico |
|---|---:|---:|
| Ver tareas | Todas | Solo libres y propias |
| Crear tarea | Sí | No |
| Editar título, descripción y estado | Cualquier tarea | Solo tarea propia |
| Asignar o liberar técnico | Sí | No |
| Tomar una tarea libre | No aplica | Sí |
| Liberar una tarea propia | No aplica | Sí |
| Eliminar tarea | Sí | No |

## Estructura

```text
backend/
  src/config · conexión MySQL
  src/middlewares · JWT y roles
  src/routes · auth, users y tasks
  database/schema.sql
app/src/
  components · botones, inputs y tarjetas
  context · autenticación y sesión segura
  screens · login, listado y formulario de tareas
  services · cliente HTTP
```

La app usa `SafeAreaProvider` y `SafeAreaView` desde `react-native-safe-area-context`.

## Ejecutar MySQL

```bash
docker compose up -d
```

Para reiniciar datos desde cero:

```bash
docker compose down -v
docker compose up -d
```

## Ejecutar backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Comprobar: `http://localhost:4000/health`.

## Ejecutar Expo

```bash
cd app
npm install
npx expo start
```

Configurar `app/src/config/api.ts`:

| Entorno | API_URL |
|---|---|
| Android Emulator | `http://10.0.2.2:4000` |
| iOS Simulator | `http://localhost:4000` |
| Celular físico | `http://IP_LOCAL_DE_TU_PC:4000` |

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| `supervisor@sigma.test` | `123456` | SUPERVISOR |
| `tecnico@sigma.test` | `123456` | TECNICO |

## Rutas de la API

| Método | Ruta | Regla |
|---|---|---|
| POST | `/auth/login` | Pública |
| GET | `/tasks` | Token JWT; filtra según rol |
| POST | `/tasks` | SUPERVISOR |
| PATCH | `/tasks/:id` | Supervisor o técnico dueño de la tarea |
| PATCH | `/tasks/:id/claim` | TECNICO, solo si está libre |
| PATCH | `/tasks/:id/release` | TECNICO, solo si es propia |
| DELETE | `/tasks/:id` | SUPERVISOR |

## Recorrido para clase

1. Iniciar como supervisor, crear una tarea sin asignar y otra asignada al técnico.
2. Editar una tarea, cambiar estado o liberar su asignación.
3. Iniciar como técnico y comprobar que ve solo tareas libres y propias.
4. Tomar una tarea libre. La API la asigna al técnico y cambia el estado a `EN_PROCESO`.
5. Editar el título y estado de la tarea tomada.
6. Intentar modificar una tarea de otro usuario mediante una petición manual: la API debe responder `403`.
