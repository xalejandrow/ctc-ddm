import AsyncStorage from '@react-native-async-storage/async-storage';

const debugAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    console.info('--- Contenido de AsyncStorage ---');
    console.log(result);
  } catch (error) {
    console.error('Error al leer AsyncStorage:', error);
  }
};

export default debugAsyncStorage;

// Llama a esta función dentro de un useEffect o al presionar un botón


// import axios from 'axios';
// axios.interceptors.request.use((request) => {
//   console.log('[API →]', request.method?.toUpperCase(), request.url, request.data);
//   return request;
// });

// axios.interceptors.response.use(
//   (response) => {
//     console.log('[API ←]', response.status, response.config.url, response.data);
//     return response;
//   },
//   (error) => {
//     console.log(
//       '[API ERROR]',
//       error.response?.status,
//       error.config?.url,
//       error.message
//     );
//     return Promise.reject(error);
//   }
// );