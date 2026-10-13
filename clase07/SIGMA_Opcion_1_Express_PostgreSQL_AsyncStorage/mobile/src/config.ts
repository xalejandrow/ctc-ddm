import { Platform } from 'react-native';
// En teléfono físico reemplazar por la IP privada de tu computadora.
// const host = Platform.select({ ios: 'localhost', android: '10.0.2.2', default: '192.168.1.10' });
const host = Platform.select({
  ios: 'localhost',
  android: '192.168.0.101', // Cambiar por la IP de tu máquina en la red local
//   default: '192.168.0.101',
});
export const API_URL = `http://${host}:3000/api`;
