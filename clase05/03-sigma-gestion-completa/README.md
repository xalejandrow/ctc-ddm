# 03 - SIGMA: gestión de equipos y tareas

Proyecto completo para mostrar navegación mediante una barra inferior y un flujo CRUD local.

## Barra de navegación

La barra inferior se define en `app/(tabs)/_layout.tsx` y tiene cuatro botones:

1. **Equipos**: listado de equipos existentes.
2. **Tareas**: listado de órdenes de trabajo.
3. **Nueva tarea**: formulario validado para crear una orden.
4. **Nuevo equipo**: formulario validado para crear un activo.

Las pantallas de detalle se abren al tocar un elemento del listado:

- `app/equipos/[id].tsx`
- `app/tareas/[id].tsx`

Ambas muestran los datos y permiten entrar en modo edición. Los cambios se guardan en memoria usando `SigmaContext`. Si se recarga la aplicación, vuelven los datos iniciales. En clases posteriores este contexto puede reemplazarse por una API y una base de datos.

## Ejecución con Expo SDK 57

```bash
npm install
npx expo install --fix
npx expo start --clear
```

## Conceptos que se pueden explicar con este ejemplo

- Rutas mediante Expo Router y grupos de rutas `(tabs)`.
- Barra inferior con `Tabs`.
- Ruta dinámica y parámetro `[id]`.
- Navegación con `router.push`.
- Context API para estado compartido.
- `FlatList`, componentes reutilizables y datos externos.
- Formularios controlados con `useState`.
- Validación antes de crear o editar.
- Alta, lectura y actualización de datos locales.

## Desafío para estudiantes

Agregar la eliminación de una tarea con una confirmación mediante `Alert.alert`. Luego, persistir los datos con una API REST.

