import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { request } from "@/services/http";
import { Task } from "@/types/task";
import { useAuth } from "@/context/AuthContext";
export default function TasksScreen() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scope, setScope] = useState("mine");
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await request<Task[]>(`/tasks?scope=${scope}`));
    } catch (e) {
      Alert.alert("Tareas", e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [scope]);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  useEffect(() => {
    load();
  }, [load]);
  async function take(id: number) {
    try {
      await request(`/tasks/${id}/take`, { method: "POST" });
      load();
    } catch (e) {
      Alert.alert("Tarea", e instanceof Error ? e.message : "Error");
    }
  }
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text>{user?.role === "SUPERVISOR" ? "Supervisor" : "Técnico"}</Text>
        </View>
        <Button
          title="Salir"
          onPress={() => {
            logout();
            router.replace("/");
          }}
        />
      </View>
      <View style={styles.actions}>
        <Button title="Mis tareas" onPress={() => setScope("mine")} />
        <Button title="Disponibles" onPress={() => setScope("available")} />
        <Button title="Mapa" onPress={() => router.push("/map")} />
        {user?.role === "SUPERVISOR" && (
          <Button title="Nueva" onPress={() => router.push("/task-form")} />
        )}
      </View>
      <FlatList
        data={tasks}
        refreshing={loading}
        onRefresh={load}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay tareas para mostrar.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/task-form", params: { id: item.id } })
            }
          >
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>
              {item.status} · {item.assigned_name || "Sin asignar"}
            </Text>
            <Text style={item.latitude ? styles.location : styles.noLocation}>
              {item.latitude
                ? `📍 Ubicación registrada${item.location_accuracy ? ` · ±${Math.round(Number(item.location_accuracy))} m` : ""}`
                : "Sin ubicación"}
            </Text>
            {user?.role === "TECHNICIAN" && item.assigned_to === null && (
              <Button title="Tomar tarea" onPress={() => take(item.id)} />
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, padding: 14, gap: 10, backgroundColor: "#f4f7fb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontWeight: "800", fontSize: 18 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    gap: 5,
  },
  taskTitle: { fontSize: 17, fontWeight: "700" },
  location: { color: "#167239" },
  noLocation: { color: "#8a5212" },
  empty: { textAlign: "center", marginTop: 45, color: "#667" },
});
