# Base App

> Configuracion base de una aplicacion Expo con React Native, TypeScript y NativeWind.

## Stack

| Tecnologia | Uso |
| --- | --- |
| Expo | Entorno de desarrollo para React Native |
| TypeScript | Tipado estatico |
| NativeWind | Clases de Tailwind CSS para React Native |
| Tailwind CSS | Utilidades y tema de estilos |

## Requisitos

- Node.js LTS
- npm
- Expo Go en un dispositivo fisico, o un simulador de iOS/Android

## 1. Crear el proyecto

```bash
npx create-expo-app@latest base-app --template blank-typescript
cd base-app
```

Comprueba que el proyecto base inicia correctamente:

```bash
npm start
```

## 2. Instalar NativeWind

Instala NativeWind y las dependencias compatibles con la version de Expo del proyecto:

```bash
npx expo install nativewind@4.2.7 react-native-reanimated react-native-safe-area-context
npx expo install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo
npx tailwindcss init
```

## 3. Configurar Tailwind

Actualiza `tailwind.config.js`. Agrega a `content` todas las carpetas donde se usaran clases de NativeWind.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 4. Crear la hoja global

Crea `global.css` en la raiz del proyecto:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 5. Configurar Babel y Metro

Crea o actualiza `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

Crea o actualiza `metro.config.js` para que Metro procese `global.css`:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

## 6. Configurar TypeScript

Crea `nativewind-env.d.ts` en la raiz del proyecto. Esta referencia habilita la propiedad `className` en los componentes de React Native. La declaracion CSS evita el error de TypeScript al importar `global.css`.

```ts
/// <reference types="nativewind/types" />

declare module "*.css";
```

Actualiza `tsconfig.json` para incluir `App.tsx`, las declaraciones de tipos y la hoja de estilos:

```json
{
  "extends": "expo/tsconfig.base",
  "include": ["**/*.ts", "**/*.tsx", "**/*.d.ts", "global.css"],
  "compilerOptions": {
    "jsx": "react",
    "strict": true
  }
}
```

## 7. Importar estilos y probar

Importa la hoja global una sola vez, al inicio de `App.tsx`, y usa `className` en los componentes compatibles:

```tsx
import "./global.css";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="rounded-lg bg-blue-500 px-4 py-3 text-xl font-bold text-white">
        NativeWind funciona
      </Text>
    </View>
  );
}
```

Inicia Expo limpiando la cache para que Metro cargue la nueva configuracion:

```bash
npm start -- --clear
```

## Comandos utiles

| Comando | Descripcion |
| --- | --- |
| `npm start` | Inicia el servidor de Expo |
| `npm run android` | Abre la aplicacion en Android |
| `npm run ios` | Abre la aplicacion en iOS |
| `npm run web` | Abre la aplicacion en web |
| `npm run lint` | Ejecuta ESLint |
| `npx tsc --noEmit` | Comprueba tipos sin generar archivos |

## Solucion de problemas

| Problema | Solucion |
| --- | --- |
| `Property 'className' does not exist` | Verifica `nativewind-env.d.ts`, que este incluido en `tsconfig.json` y reinicia el servidor de TypeScript del editor. |
| `Cannot find module './global.css'` | Conserva `declare module "*.css";` en `nativewind-env.d.ts` e incluye `global.css` en `tsconfig.json`. |
| Las clases no se reflejan | Revisa las rutas de `content` en `tailwind.config.js` y ejecuta `npm start -- --clear`. |

## Verificacion final

```bash
npm run lint
npx tsc --noEmit
```
