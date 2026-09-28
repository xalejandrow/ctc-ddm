import { Stack } from 'expo-router';
import { SigmaProvider } from '../context/SigmaContext';

export default function RootLayout() {
  return <SigmaProvider><Stack screenOptions={{ headerStyle: { backgroundColor: '#102A43' }, headerTintColor: '#FFFFFF' }}>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="equipos/[id]" options={{ title: 'Detalle de equipo' }} />
    <Stack.Screen name="tareas/[id]" options={{ title: 'Detalle de tarea' }} />
  </Stack></SigmaProvider>;
}
