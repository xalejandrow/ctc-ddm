# SIGMA: autenticación, autorización y consumo seguro de API

Ejemplo básico para comprender tres ideas:

1. **Autenticación:** el backend verifica correo y contraseña en `POST /auth/login`.
2. **Autorización:** solo el rol `SUPERVISOR` puede ejecutar `PATCH /tasks/:id/assign`.
3. **Consumo seguro:** la app guarda el token con `expo-secure-store` y lo envía como `Authorization: Bearer <token>`.

## Estructura

```text
Ejemplo_SIGMA_Seguridad_Basico/
├── backend/        API Node.js + Express + JWT
└── app/            App Expo + TypeScript
```

## 1. Ejecutar el backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

La API queda disponible en `http://localhost:4000`.

Usuarios de prueba:

| Correo | Contraseña | Rol | Resultado al asignar tarea |
|---|---|---|---|
| `tecnico@sigma.test` | `123456` | `TECNICO` | Recibe `403 Forbidden` |
| `supervisor@sigma.test` | `123456` | `SUPERVISOR` | La API permite la acción |

## 2. Ejecutar la app Expo

En otra terminal:

```bash
cd app
npm install
npx expo start
```

Antes de probar, revisar `app/App.tsx` y ajustar `API_URL`:

| Dónde corre Expo | Valor sugerido |
|---|---|
| Emulador Android | `http://10.0.2.2:4000` |
| Simulador iOS | `http://localhost:4000` |
| Teléfono físico | `http://IP_LOCAL_DE_TU_PC:4000` |

El teléfono y la computadora deben estar en la misma red. En una aplicación publicada se debe utilizar **HTTPS**.

## Recorrido para explicar en clase

1. Iniciar sesión como `tecnico@sigma.test`.
2. Cargar las tareas: la API permite la ruta porque el token es válido.
3. Presionar **Asignar tarea 2 al técnico**: la API responde `403` porque el rol no es `SUPERVISOR`.
4. Cerrar sesión e iniciar como `supervisor@sigma.test`.
5. Repetir la acción: la API ahora permite asignar la tarea.

## Qué representa cada código HTTP

| Código | Significado en este ejemplo |
|---|---|
| `200` | Operación exitosa |
| `401` | No hay token, es inválido o venció |
| `403` | La identidad es válida, pero no tiene permiso |
| `404` | La tarea no existe |
| `422` | Los datos enviados no cumplen la regla esperada |

## Límites intencionales del ejemplo

- Los usuarios están en memoria y las contraseñas están en texto plano para facilitar la explicación. En producción se debe usar una base de datos y `bcrypt` o `argon2`.
- El secreto JWT de `.env.example` es solo ilustrativo. En producción debe ser largo, único y nunca subirse al repositorio.
- El token dura 30 minutos. Un proyecto real puede sumar refresh tokens y revocación de sesión.
