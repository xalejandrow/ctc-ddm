# 02 - SIGMA completo

El proyecto está preparado para **Expo SDK 57**. Después de `npm install`, ejecutar `npx expo install --fix` y luego `npx expo start --clear`.

## Flujo incluido

1. **Inicio**: acceso a las tareas.
2. **Tareas**: `FlatList` con datos externos.
3. **Detalle**: ruta dinámica `tareas/[id]` y lectura del parámetro `id`.
4. **Reporte**: recibe `tareaId`, contiene campos controlados y valida antes de guardar.

## Conceptos que muestra

- Expo Router y `Stack`.
- `router.push`, `router.back` y `useLocalSearchParams`.
- Rutas dinámicas con `[id].tsx`.
- Componentes extraídos: `TaskCard` y `FormInput`.
- Datos en un archivo separado.
- `FlatList`.
- `useState`, `TextInput`, objeto de errores y validación.
- Casos de prueba manuales con formulario vacío, horas inválidas y formulario correcto.

## Desafíos sugeridos

1. Agregar un selector de estado final: Resuelto, Pendiente o Derivado.
2. Guardar reportes válidos en un arreglo local y mostrarlos en una nueva pantalla.
3. Reemplazar los datos simulados por una API cuando se trabaje consumo HTTP.
