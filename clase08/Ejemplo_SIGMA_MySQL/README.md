# SIGMA con MySQL, Express y Expo

Ejemplo para enseñar autenticación, autorización y consumo seguro de una API sin usar offline-first.

## Arquitectura

```text
App Expo (pantallas, componentes y contexto)
        │ HTTPS / JSON / Bearer token
        ▼
API Express (JWT, middlewares y rutas)
        ▼
MySQL (usuarios y tareas)
```

La app se organiza en:

```text
app/src/
├── components/  AppButton, AppInput y TaskItem
├── config/      URL de la API
├── context/     AuthContext
├── screens/     LoginScreen, TasksScreen y Root
├── services/    apiFetch
└── types/       tipos compartidos
```

`SafeAreaProvider` y `SafeAreaView` se importan desde `react-native-safe-area-context`, no desde `react-native`.

## 1. Levantar MySQL

Desde la raíz del proyecto:

```bash
docker compose up -d
```

La primera vez, MySQL crea la base `sigma_db`, las tablas y los usuarios de prueba. Para reiniciar completamente los datos:

```bash
docker compose down -v
docker compose up -d
```

## 2. Ejecutar el backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Comprobar la conexión en `http://localhost:4000/health`.

## 3. Ejecutar Expo

En otra terminal:

```bash
cd app
npm install
npx expo start
```

Antes de ejecutar, ajustar `app/src/config/api.ts`:

| Entorno | URL |
|---|---|
| Emulador Android | `http://10.0.2.2:4000` |
| Simulador iOS | `http://localhost:4000` |
| Celular físico | `http://IP_LOCAL_DE_TU_PC:4000` |

Para un celular físico, el backend y el teléfono deben estar en la misma red. En producción se utiliza HTTPS.

## Usuarios de demostración

| Correo | Contraseña | Rol | Qué puede hacer |
|---|---|---|---|
| `tecnico@sigma.test` | `123456` | TECNICO | Iniciar sesión y ver solo sus tareas asignadas |
| `supervisor@sigma.test` | `123456` | SUPERVISOR | Ver todas las tareas y asignar la tarea 2 |

## Rutas principales

| Método y ruta | Protección | Descripción |
|---|---|---|
| `POST /auth/login` | Pública | Comprueba email y contraseña hasheada con bcrypt |
| `GET /auth/me` | Token JWT | Restaura la sesión segura al abrir la app |
| `GET /tasks` | Token JWT | Técnico ve sus tareas; supervisor ve todas |
| `PATCH /tasks/:id/assign` | Token JWT + SUPERVISOR | Asigna una tarea a un técnico |

## Conceptos que muestra el ejemplo

- **Autenticación:** correo y contraseña, `bcrypt.compare` y emisión de JWT.
- **Autorización por rol:** middleware `requireRole('SUPERVISOR')`.
- **Autorización por propiedad:** el técnico solo recibe tareas cuyo `assigned_to` coincide con su id.
- **Consumo seguro:** token almacenado con `expo-secure-store` y enviado como `Authorization: Bearer`.
- **401 y 403:** `401` significa token ausente, inválido o vencido; `403` significa que la identidad es válida pero no tiene permiso.

## Aclaraciones didácticas

- No se implementa offline-first ni SQLite local: los datos se consultan directamente a la API.
- El ejemplo usa HTTP local para facilitar el desarrollo. La versión de producción debe usar HTTPS y un `JWT_SECRET` seguro definido en el entorno.
- Las contraseñas de demostración ya están hasheadas dentro de `schema.sql`; no se guardan como texto plano en MySQL.


# Pasar de Expo.v57 a v58

```bash
cd app
npm install expo@^58.0.0
npx expo install --fix
npx expo-doctor@latest
npx expo start --clear
```