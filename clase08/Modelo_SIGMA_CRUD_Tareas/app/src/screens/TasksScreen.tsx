import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { TaskCard } from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import { Task, TaskPayload, Technician } from "../types";
import { TaskFormScreen } from "./TaskFormScreen";

export function TasksScreen() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [editing, setEditing] = useState<Task | null | undefined>(undefined);
  const load = useCallback(async () => {
    try {
      setTasks(await apiFetch<Task[]>("/tasks", {}, token));
      if (user?.role === "SUPERVISOR")
        setTechnicians(
          await apiFetch<Technician[]>("/users/technicians", {}, token),
        );
    } catch (e) {
      const status = (e as Error & { status?: number }).status;
      if (status === 401) {
        await logout();
        return;
      }
      Alert.alert("Error", e instanceof Error ? e.message : "Error");
    }
  }, [token, user?.role, logout]);
  useEffect(() => {
    load();
  }, [load]);
  async function save(payload: TaskPayload) {
    if (editing === null)
      await apiFetch<Task>(
        "/tasks",
        { method: "POST", body: JSON.stringify(payload) },
        token,
      );
    else
      await apiFetch<Task>(
        `/tasks/${editing?.id}`,
        { method: "PATCH", body: JSON.stringify(payload) },
        token,
      );
    setEditing(undefined);
    await load();
  }
  async function claim(id: number) {
    try {
      await apiFetch<Task>(`/tasks/${id}/claim`, { method: "PATCH" }, token);
      await load();
    } catch (e) {
      Alert.alert(
        "No se puede tomar",
        e instanceof Error ? e.message : "Error",
      );
    }
  }
  async function release(id: number) {
    try {
      await apiFetch<Task>(`/tasks/${id}/release`, { method: "PATCH" }, token);
      await load();
    } catch (e) {
      Alert.alert(
        "No se puede liberar",
        e instanceof Error ? e.message : "Error",
      );
    }
  }
  function remove(id: number) {
    Alert.alert("Eliminar tarea", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await apiFetch<void>(`/tasks/${id}`, { method: "DELETE" }, token);
            await load();
          } catch (e) {
            Alert.alert("Error", e instanceof Error ? e.message : "Error");
          }
        },
      },
    ]);
  }
  if (editing !== undefined && user)
    return (
      <TaskFormScreen
        task={editing}
        user={user}
        technicians={technicians}
        onSave={save}
        onCancel={() => setEditing(undefined)}
      />
    );
  if (!user) return null;
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Tareas SIGMA</Text>
        <Text style={styles.role}>
          {user.name} · {user.role}
        </Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            user={user}
            onEdit={() => setEditing(item)}
            onClaim={() => claim(item.id)}
            onRelease={() => release(item.id)}
            onDelete={() => remove(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay tareas disponibles.</Text>
        }
      />
      <View style={styles.footer}>
        {user.role === "SUPERVISOR" && (
          <AppButton title="Crear tarea" onPress={() => setEditing(null)} />
        )}
        {user.role === "TECNICO" && (
          <Text style={styles.help}>
            Podés tomar tareas abiertas o editar/liberar las que te pertenecen.
          </Text>
        )}
        <AppButton
          title="Actualizar listado"
          onPress={load}
          color="secondary"
        />
        <AppButton title="Cerrar sesión" onPress={logout} color="danger" />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F9FC" },
  header: { padding: 20, borderBottomWidth: 1, borderColor: "#D6E0EA" },
  title: { fontSize: 26, fontWeight: "700", color: "#102A43" },
  role: { marginTop: 4, color: "#0F8B8D", fontWeight: "700" },
  list: { padding: 14, flexGrow: 1 },
  footer: { padding: 14, borderTopWidth: 1, borderColor: "#D6E0EA", gap: 9 },
  help: { color: "#52667A", lineHeight: 18 },
  empty: { textAlign: "center", marginTop: 30, color: "#52667A" },
});
