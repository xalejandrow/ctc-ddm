# Login Star Wars con Hooks

Ejemplo para copiar dentro de un proyecto Expo existente. Simula un login con usuarios locales y, despues de validar las credenciales, consulta las peliculas de Star Wars en SWAPI y las muestra con `FlatList`.

## Instalacion

1. Cree un proyecto Expo con TypeScript o copie estos archivos en la raiz de uno existente.
2. Use el `package.json` incluido, que conserva las versiones del paquete base indicado. No se agregaron dependencias externas.
3. Instale las dependencias con `npm install`.
4. Inicie el proyecto con `npm start`.

El punto de entrada de Expo debe cargar `App.tsx`, como sucede en un proyecto Expo estandar.

## Credenciales de prueba

| Usuario | Clave |
| --- | --- |
| `leia` | `rebeldes` |
| `luke` | `fuerza` |
| `han` | `halcon` |

Los usuarios estan definidos en `src/data/usuarios.ts`. Son datos de demostracion: una aplicacion real nunca debe almacenar claves en el cliente.

## Estructura

```text
12-login-star-wars/
├── App.tsx
├── package.json
└── src/
    ├── components/
    │   ├── LoginForm.tsx
    │   └── PeliculasList.tsx
    ├── context/AuthContext.tsx
    └── data/usuarios.ts
```

## Hooks utilizados

| Hook | Archivo | Uso |
| --- | --- | --- |
| `useState` | `LoginForm.tsx`, `AuthContext.tsx`, `PeliculasList.tsx` | Guarda los campos, la sesion, el mensaje de error y el texto del filtro. |
| `useContext` | `AuthContext.tsx`, `App.tsx` | Comparte la sesion y las acciones de login/logout sin pasar props. |
| `useRef` | `LoginForm.tsx` | Enfoca el campo de clave al terminar de escribir el usuario. |
| `useEffect` | `PeliculasList.tsx` | Consulta `https://swapi.py4e.com/api/films/` al mostrar o reintentar el listado y cancela la consulta al desmontar. |
| `useReducer` | `PeliculasList.tsx` | Gestiona los estados de carga, exito y error de la consulta. |
| `useMemo` | `PeliculasList.tsx` | Calcula las peliculas filtradas y ordenadas solo cuando cambia el filtro o la lista. |
| `useCallback` | `AuthContext.tsx`, `PeliculasList.tsx` | Mantiene estables las funciones de autenticacion y las props de `FlatList`. |

## Flujo

1. `App.tsx` monta `AuthProvider`.
2. `LoginForm.tsx` valida usuario y clave contra el array externo de `usuarios.ts`.
3. Al validar, `usuarioActivo` cambia en el contexto y se muestra `PeliculasList.tsx`.
4. El listado consulta SWAPI, muestra las peliculas con `FlatList` y permite filtrarlas por titulo.
