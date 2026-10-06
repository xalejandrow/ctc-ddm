import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTasks } from "../../src/context/TaskContext";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, toggle, remove } = useTasks();
  const task = tasks.find((item) => item.id === Number(id));

  if (!task)
    return (
      <View style={styles.center}>
        <Text>La tarea no está disponible.</Text>
      </View>
    );

  async function changeStatus() {
    try {
      await toggle(task);
    } catch (err) {
      Alert.alert(
        "No se pudo actualizar",
        err instanceof Error ? err.message : "Error inesperado",
      );
    }
  }
  function confirmDelete() {
    Alert.alert("Eliminar tarea", "Esta acción se simula en JSONPlaceholder.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await remove(task.id);
            router.replace("/");
          } catch (err) {
            Alert.alert(
              "No se pudo eliminar",
              err instanceof Error ? err.message : "Error inesperado",
            );
          }
        },
      },
    ]);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.code}>
        ORDEN DE TRABAJO OT-{String(task.id).padStart(3, "0")}
      </Text>
      <Text style={styles.title}>{task.title}</Text>
      <View style={styles.info}>
        <Text>Responsable: Técnico {task.userId}</Text>
        <Text>Estado: {task.completed ? "Realizada" : "Pendiente"}</Text>
      </View>
      <Pressable style={styles.primary} onPress={changeStatus}>
        <Text style={styles.primaryText}>
          {task.completed ? "Marcar pendiente" : "Marcar realizada"}
        </Text>
      </Pressable>
      <Pressable style={styles.danger} onPress={confirmDelete}>
        <Text style={styles.dangerText}>Eliminar tarea</Text>
      </Pressable>
      <Text style={styles.note}>
        PATCH y DELETE responden como exitosos, pero JSONPlaceholder no conserva
        el cambio luego de recargar.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  code: { fontWeight: "800", color: "#17365D" },
  title: { fontSize: 26, fontWeight: "800", textTransform: "capitalize" },
  info: { backgroundColor: "white", padding: 16, borderRadius: 10, gap: 8 },
  primary: {
    backgroundColor: "#17365D",
    borderRadius: 8,
    alignItems: "center",
    padding: 14,
  },
  primaryText: { color: "white", fontWeight: "800" },
  danger: {
    borderWidth: 1,
    borderColor: "#B42318",
    borderRadius: 8,
    alignItems: "center",
    padding: 14,
  },
  dangerText: { color: "#B42318", fontWeight: "800" },
  note: { color: "#52616B", fontSize: 13, lineHeight: 19 },
});
