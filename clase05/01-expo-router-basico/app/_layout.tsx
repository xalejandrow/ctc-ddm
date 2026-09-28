import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      <Stack.Screen name="segunda" options={{ title: 'Segunda pantalla' }} />
    </Stack>
  );
}
