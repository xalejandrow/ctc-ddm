# SIGMA Opción C — Supabase + PostgreSQL + SQLite local

Ejemplo offline-first sin backend propio. La app escribe primero en SQLite y mantiene una cola local; al sincronizar usa la API de Supabase para enviar los cambios a PostgreSQL y descargar los datos remotos.

## Arquitectura

`Expo + SQLite (tasks, sync_queue) + NetInfo` → `Supabase Data API` → `PostgreSQL`.

## Requisitos

- Node.js 22.13 o superior.
- Una cuenta y un proyecto de Supabase.
- Expo Go en el teléfono o un emulador.

## Configuración

1. En Supabase, abrir **SQL Editor** y ejecutar `supabase/schema.sql`.
2. En **Connect**, copiar la URL del proyecto y la **Publishable key**; no usar la clave `service_role` en una app móvil.
3. En `mobile`, copiar `.env.example` como `.env` y completar:

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE_PUBLICA
```

4. Ejecutar:

```bash
cd mobile
npm install
npx expo start
```

## Prueba offline

1. Abrir la app sin configurar Supabase o desconectar Internet.
2. Crear, finalizar o eliminar tareas: los cambios se guardan en SQLite y la cola aumenta.
3. Recuperar la conexión, configurar `.env` y reiniciar Expo.
4. Presionar **Sincronizar con Supabase**. La cola se vacía y las tareas quedan `SINCRONIZADA`.

## Datos locales y remotos

| Lugar | Datos |
|---|---|
| SQLite, tabla `tasks` | Copia local de las tareas; permite que la app funcione sin red. |
| SQLite, tabla `sync_queue` | `UPSERT` y `DELETE` pendientes; resiste cerrar la app. |
| Supabase PostgreSQL, tabla `tasks` | Copia remota compartida y persistente. |

## Seguridad

Las políticas de `schema.sql` son deliberadamente abiertas para enseñar y probar sin autenticación. Antes de publicar, agregar Supabase Auth, un campo `user_id`, políticas por usuario y validación de conflictos mediante versión o `updated_at`.
