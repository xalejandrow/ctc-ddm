# SIGMA Opción 2 NestJS PostgreSQL SQLite Offline First

Ejemplo de arquitectura offline-first. La app usa SQLite como fuente local de datos y una tabla `sync_queue` para operaciones pendientes. La API NestJS replica esos cambios en PostgreSQL.

## Arquitectura
`Expo + expo-sqlite + NetInfo + Axios` → `NestJS REST API` → `PostgreSQL`.

## Diferencias respecto a la opción 1

- La cola y las tareas viven en tablas SQLite, no como un JSON entero.
- Las escrituras locales y el encolado se realizan dentro de una transacción SQLite.
- Es adecuada para listas grandes, filtros, relaciones y archivos pendientes.

## Ejecutar

```bash
docker compose up --build
cd mobile && npm install && npx expo start
```

El proyecto está preparado para Expo 57, React 19.2.3 y React Native 0.86.3.

Ajustar `mobile/src/config.ts` con la IP de la computadora para un teléfono físico.

## Ruta de aprendizaje
1. Crear tareas sin red y revisar `sync_queue`.
2. Restaurar conexión y ejecutar sincronización.
3. Agregar autenticación JWT, conflictos por versión y sincronización bidireccional.

`synchronize: true` de TypeORM se usa solo para clase. En producción se reemplaza por migraciones.
