# Pasos para probar los ejemplos

## 1 - Si bajaron el código de ejemplo desde el repositorio de github
- Posicionarse en la carpeta del ejemplo: cd clase04
- ejecutar el siguiente comando para bajar las librerías de react native
npm install
- Ejecutamos el proyecto
npm run start

## 2 - Si se van a copiar los códigos de ejemplo y crear una aplicación por cada uno
- En la terminal ejecutamos el comando para crear un nuevo proyecto
npx create-expo-app@latest clase04ej01 --template blank-typescript
- Nos cambiamos a la carpeta del proyecto creado
cd clase04ej01 (o el nombre que le hayamos puesto)
- ejecutamos el comando para iniciar el proyecto
npm run start

Luego abrimos una de las carpetas de los ejemplos y copiamos todo el código del archivo App.tsx y lo copiamos en el App.tsx de nuestro nuevo proyecto

Ej:
Copiamos el contenido del archivo Clase_04_Codigo_React_Native_SIGMA/01_Hola_SIGMA/App.tsx
Lo pegamos en clase04ej01/App.tsx (que es el archivo del proyecto que creamos anteriormente).

NOTA IMPORTANTE:
SafeAreaView ya no tiene soporte en React Native, por lo tanto, hay que cambiar instalar la dependencia react-native-safe-area-context 
- Ejecutamos el comando 
npm install react-native-safe-area-context
para saber si ya está instalada podemos revisar el archivo package.json y en las dependencias verificar que existe una línea de este estilo: "react-native-safe-area-context": "~5.7.0" (la versión puede variar si es posterior a la relización de este manual)

Luego deberemos cambiar la importación de SafeAreaView desde "react-native" a "react-native-safe-area-context"

Ejemplo
- Antes
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

- Ahora
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

También deberemos agregar un SafeAreaProvider que contiene el/los SafeAreaView.
import { SafeAreaProvider } from 'react-native-safe-area-context';

En el ejemplo de clase04, se llama a los archivos que contienen un SafeAreaView, para ello, utilizaremos un SafeAreaProvider que los contiene.

### Para más info
https://docs.expo.dev/versions/latest/sdk/safe-area-context/

