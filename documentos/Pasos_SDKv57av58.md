Para los ejemplos que hicimos, entrá específicamente a la carpeta app:
```bash
cd app
npm install expo@^58.0.0
npx expo install --fix
npx expo-doctor@latest
npx expo start --clear
````

No hace falta actualizar el backend Node/Express ni MySQL: el cambio corresponde solamente al proyecto Expo.

Si expo-doctor informa errores de dependencias y --fix no los resuelve, recién ahí podés reinstalar dependencias:
```bash
rm -rf node_modules package-lock.json
npm install expo@^58.0.0
npm install
npx expo install --fix
npx expo-doctor@latest
npx expo start --clear
````
