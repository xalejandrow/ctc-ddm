# Ejemplo básico: GET con fetch

La aplicación consulta `https://jsonplaceholder.typicode.com/todos/1` al abrirse. Es el ejemplo para explicar, en orden:

1. `useEffect` ejecuta una función asíncrona cuando se monta la pantalla.
2. `fetch` devuelve una `Promise<Response>`.
3. `await fetch(...)` espera la respuesta sin bloquear la interfaz.
4. `response.ok` controla los errores HTTP.
5. `await response.json()` convierte el cuerpo JSON a un objeto JavaScript.
6. `try`, `catch` y `finally` actualizan los estados de carga y error.
