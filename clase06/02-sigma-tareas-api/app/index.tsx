import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTasks } from "../src/context/TaskContext";
import { Task } from "../src/types/task";

function TaskCard({ task }: { task: Task }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/task/${task.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.code}>OT-{String(task.id).padStart(3, "0")}</Text>
        <Text
          style={[styles.status, task.completed ? styles.done : styles.pending]}
        >
          {task.completed ? "Realizada" : "Pendiente"}
        </Text>
      </View>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.detail}>Responsable: Técnico {task.userId}</Text>
    </Pressable>
  );
}

export default function TasksScreen() {
  const { tasks, loading, error, refresh } = useTasks();

  if (loading && tasks.length === 0)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E5B9B" />
        <Text>Cargando tareas...</Text>
      </View>
    );
  if (error && tasks.length === 0)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.primary} onPress={refresh}>
          <Text style={styles.primaryText}>Reintentar</Text>
        </Pressable>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TaskCard task={item} />}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>Órdenes de trabajo</Text>
            <Text style={styles.intro}>
              Tareas de mantenimiento obtenidas mediante una API REST.
            </Text>
          </>
        }
        ListEmptyComponent={<Text>No hay tareas para mostrar.</Text>}
      />
      <Pressable style={styles.fab} onPress={() => router.push("/task/new")}>
        <Text style={styles.fabText}>+ Nueva tarea</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10, paddingBottom: 92 },
  heading: { fontSize: 25, fontWeight: "800", color: "#17365D" },
  intro: { color: "#52616B", marginTop: 4, marginBottom: 12 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    gap: 7,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  code: { fontWeight: "800", color: "#17365D" },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    fontSize: 12,
    fontWeight: "700",
  },
  done: { backgroundColor: "#D1FADF", color: "#027A48" },
  pending: { backgroundColor: "#FEF0C7", color: "#B54708" },
  taskTitle: { fontSize: 17, fontWeight: "700", textTransform: "capitalize" },
  detail: { color: "#52616B" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
  },
  error: { color: "#B42318", textAlign: "center" },
  primary: {
    backgroundColor: "#1E5B9B",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryText: { color: "white", fontWeight: "700" },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 18,
    backgroundColor: "#17365D",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
  },
  fabText: { color: "white", fontWeight: "800" },
});
