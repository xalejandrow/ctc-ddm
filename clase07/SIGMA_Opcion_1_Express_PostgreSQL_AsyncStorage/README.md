# SIGMA Opción 1 Express PostgreSQL AsyncStorage

Ejemplo didáctico para entender la integración móvil + API propia.

## Arquitectura
`Expo + AsyncStorage + NetInfo + Axios` → `Express REST API` → `PostgreSQL`.

La app muestra primero los datos locales. Cada operación se guarda como una entrada `CREATE`, `UPDATE` o `DELETE` en una cola persistente de AsyncStorage. Al presionar **Sincronizar**, procesa esa cola contra la API.

## Ejecutar

1. Levantar la API y PostgreSQL:
```bash
docker compose up --build
```
2. En `mobile/src/config.ts`, ajustar la IP si se prueba desde un teléfono físico.
3. En otra terminal:
```bash
cd mobile
npm install
npx expo start
```

El proyecto está preparado para Expo 57, React 19.2.3 y React Native 0.86.3.

## Prueba de clase

1. Crear una tarea con la API apagada: queda `PENDIENTE`.
2. Levantar `docker compose up`.
3. Presionar **Sincronizar**: la cola se vacía y la tarea queda `SINCRONIZADA`.

Este ejemplo usa AsyncStorage para que el código sea corto. Para un dominio con muchas entidades, búsquedas o archivos, usar la opción 2 con SQLite.
