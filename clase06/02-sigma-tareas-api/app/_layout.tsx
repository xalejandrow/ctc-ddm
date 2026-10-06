import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TaskProvider } from "../src/context/TaskContext";

export default function RootLayout() {
  return (
    <TaskProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: "#17365D" }, headerTintColor: "#FFFFFF", contentStyle: { backgroundColor: "#F5F7FA" } }}>
        <Stack.Screen name="index" options={{ title: "SIGMA Mantenimiento" }} />
        <Stack.Screen name="task/new" options={{ title: "Nueva tarea", presentation: "modal" }} />
        <Stack.Screen name="task/[id]" options={{ title: "Detalle de tarea" }} />
      </Stack>
    </TaskProvider>
  );
}
