# Ejemplo 08 — SIGMA con estilos globales

Aplicación didáctica de React Native + TypeScript para listar equipos del
gestor de mantenimiento de hardware SIGMA.

El ejemplo incluye:

- datos y tipos en archivos externos;
- componentes reutilizables fuera de `App.tsx`;
- visualización con `FlatList` y `ScrollView`;
- selector en pantalla para alternar entre ambas listas;
- estilos compartidos en un único archivo global;
- paleta, espaciados y bordes centralizados en un tema.

## Crear el proyecto

Necesitás Node.js y Expo. En una terminal ejecutá:

```bash
npx create-expo-app@latest sigma-estilos-globales -t blank-typescript
cd sigma-estilos-globales
```

Reemplazá el `App.tsx` generado por el de este ejemplo y copiá la carpeta
`src` completa dentro del proyecto. Después iniciá Expo:

```bash
npx expo start
```

Podés abrir la aplicación con Expo Go o con un emulador.

## Estructura

```text
sigma-estilos-globales/
├── App.tsx
└── src/
    ├── components/
    │   ├── EncabezadoInventario.tsx
    │   ├── ResumenInventario.tsx
    │   └── TarjetaEquipo.tsx
    ├── data/
    │   └── equipos.ts
    ├── screens/
    │   ├── InventarioFlatList.tsx
    │   └── InventarioScrollView.tsx
    ├── styles/
    │   └── globalStyles.ts
    ├── theme/
    │   └── theme.ts
    └── types/
        └── Equipo.ts
```

## Cómo funcionan los estilos globales

`src/styles/globalStyles.ts` contiene el `StyleSheet` compartido por las
pantallas y los componentes. Cada archivo lo importa así:

```ts
import { globalStyles as styles } from '../styles/globalStyles';
```

`src/theme/theme.ts` contiene los valores visuales reutilizables:

- `colors`: paleta de la aplicación;
- `spacing`: escala de separaciones;
- `radius`: radios de bordes;
- `statusColors`: color correspondiente a cada estado del equipo.

La insignia de estado combina un estilo global con un color dinámico:

```tsx
<View
  style={[
    styles.statusBadge,
    { backgroundColor: statusColors[equipo.estado] },
  ]}
>
```

De este modo, la estructura visual permanece centralizada y solamente cambia
el valor que depende de los datos.

## FlatList y ScrollView

- **FlatList:** renderiza de forma eficiente los elementos visibles. Es la
  opción recomendada para inventarios largos.
- **ScrollView:** renderiza todos los elementos al mismo tiempo. Es sencilla y
  apropiada para listas pequeñas.

El selector de `App.tsx` permite comparar ambas implementaciones sin
modificar el código.

## Propuestas de práctica

1. Agregar un equipo en `src/data/equipos.ts`.
2. Cambiar el color principal desde `src/theme/theme.ts`.
3. Incorporar un nuevo estado al tipo `EstadoEquipo`.
4. Agregar un buscador y filtrar los datos antes de enviarlos a la lista.
5. Crear una pantalla de detalle reutilizando el tipo `Equipo`.
