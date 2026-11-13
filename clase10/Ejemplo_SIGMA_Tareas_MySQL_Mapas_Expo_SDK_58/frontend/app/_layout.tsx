import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="tasks" options={{ title: "SIGMA · Tareas" }} />
          <Stack.Screen name="map" options={{ title: "Mapa de incidencias" }} />
          <Stack.Screen name="task-form" options={{ title: "Editar tarea" }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
