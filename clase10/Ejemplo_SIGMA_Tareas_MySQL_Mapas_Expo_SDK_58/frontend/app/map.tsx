import { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { request } from "@/services/http";
import { Task } from "@/types/task";
import { TaskMap } from "@/components/TaskMap";
export default function MapScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const load = useCallback(async () => {
    try {
      setTasks(await request<Task[]>("/tasks/map"));
    } catch (e) {
      Alert.alert("Mapa", e instanceof Error ? e.message : "Error");
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.text}>
        Se muestran las tareas abiertas con coordenadas registradas.
      </Text>
      <TaskMap tasks={tasks} height={470} />
      <View>
        <Button title="Actualizar mapa" onPress={load} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, gap: 12, backgroundColor: "#f4f7fb" },
  text: { paddingHorizontal: 14, paddingTop: 12, color: "#465663" },
});
