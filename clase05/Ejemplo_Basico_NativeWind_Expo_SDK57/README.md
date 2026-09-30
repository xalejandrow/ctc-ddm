# NativeWind básico con Expo SDK 57

Ejemplo didáctico con una tarjeta de orden de trabajo SIGMA. Cambia el estado con un botón y utiliza utilidades de NativeWind mediante `className`.

## Instalación

```bash
npm install
npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui
npx expo start --clear
```

`expo install` elige las versiones nativas compatibles con el SDK 57. NativeWind v5 RC0 requiere que `nativewind@5.0.0-rc.0` y `react-native-css@3.1.0-rc.0` permanezcan instalados juntos.

## Archivos importantes

- `global.css`: importa Tailwind CSS y el tema de NativeWind.
- `postcss.config.mjs`: activa el plugin de Tailwind CSS.
- `metro.config.js`: envuelve Metro con `withNativewind`.
- `app/_layout.tsx`: importa el CSS una única vez para Expo Router.
- `app/index.tsx`: usa `className` en componentes React Native.

## Práctica sugerida

Agregá una segunda tarjeta y aplicá utilidades para color, espaciado, tipografía y bordes. Después, creá un modo oscuro usando el prefijo `dark:`.

