import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#102A43' }, headerTintColor: '#FFFFFF' }}>
      <Stack.Screen name="index" options={{ title: 'SIGMA' }} />
      <Stack.Screen name="tareas" options={{ title: 'Órdenes de trabajo' }} />
      <Stack.Screen name="tareas/[id]" options={{ title: 'Detalle de tarea' }} />
      <Stack.Screen name="reporte" options={{ title: 'Nuevo reporte' }} />
    </Stack>
  );
}
