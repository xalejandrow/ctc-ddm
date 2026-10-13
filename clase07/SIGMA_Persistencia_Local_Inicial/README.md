# SIGMA - Persistencia local inicial

Proyecto Expo TypeScript básico para la clase de persistencia local.

Preparado para Expo 57, React 19.2.3 y React Native 0.86.3.

## Qué hace

- Crea tareas de mantenimiento.
- Las guarda en AsyncStorage.
- Las recupera aunque se cierre por completo la app.
- Permite completar, eliminar y filtrar tareas.
- Marca cada cambio como `PENDIENTE`; será la entrada para la futura cola de sincronización.

## Ejecutar

```bash
npm install
npx expo start
```

Si Expo solicita compatibilizar dependencias, ejecutar:

```bash
npx expo install @react-native-async-storage/async-storage
```

## Siguiente etapa

Cuando se defina el backend, se agregará una cola de operaciones (CREATE, UPDATE y DELETE), detección de red con NetInfo y un servicio que envíe únicamente los cambios pendientes.

**No guardar contraseñas, JWT ni claves de API en AsyncStorage.** Para tokens se utilizará `expo-secure-store`.
