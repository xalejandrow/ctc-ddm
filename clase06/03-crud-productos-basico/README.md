# CRUD básico de productos

Ejemplo en una sola pantalla para introducir las cuatro operaciones de una API REST usando `fetch`, `async/await` y la API pública [DummyJSON](https://dummyjson.com/).

## Operaciones

- `GET /products?limit=10`: lista productos con su imagen.
- `POST /products/add`: crea un producto al presionar **Agregar**.
- `PUT /products/:id`: agrega el texto `(oferta)` al nombre al presionar **Editar**.
- `DELETE /products/:id`: elimina el producto luego de confirmarlo.

DummyJSON simula las respuestas de escritura, pero no persiste los cambios en el servidor. Por eso la aplicación actualiza su estado local tras crear, editar o eliminar.

## Ejecutar

```bash
npm install
npx expo start
```
