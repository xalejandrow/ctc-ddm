# SIGMA Mantenimiento con API REST

## Estructura

- `app/index.tsx`: listado de órdenes de trabajo.
- `app/task/new.tsx`: formulario que utiliza `POST`.
- `app/task/[id].tsx`: detalle con acciones `PATCH` y `DELETE`.
- `src/services/tasksApi.ts`: única capa que conoce la URL de la API y usa `fetch`.
- `src/context/TaskContext.tsx`: estado compartido, carga inicial y actualización local luego de cada operación.
- `src/types/task.ts`: contrato TypeScript para los datos que hoy entrega JSONPlaceholder.

## Flujo didáctico sugerido

1. Empezar explicando `getTasks` y ejecutar solamente el listado.
2. Mostrar los estados `loading`, `error` y `refreshing`.
3. Revisar `createTask`: encabezado `Content-Type`, `JSON.stringify` y respuesta `201` simulada.
4. Revisar `toggleTask`: diferencia entre `PUT` y el `PATCH` que se usa aquí.
5. Revisar la eliminación y el estado local inmutable con `filter`.
6. Sustituir luego `BASE_URL` y el tipo `Task` por el contrato de la API creada por los estudiantes.
