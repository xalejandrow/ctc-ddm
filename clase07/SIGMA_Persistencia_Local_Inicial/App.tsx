import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createTask, removeTask, toggleTask } from "./src/taskService";
import { loadTasks } from "./src/storage";
import { Task } from "./src/types";

type Filter = "TODAS" | "PENDIENTES" | "FINALIZADAS";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("TODAS");

  const refresh = async () => setTasks(await loadTasks());
  useEffect(() => {
    refresh();
  }, []);

  const add = async () => {
    if (!title.trim())
      return Alert.alert(
        "Falta la tarea",
        "Escribí qué mantenimiento hay que realizar.",
      );
    await createTask(title);
    setTitle("");
    await refresh();
  };

  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          filter === "TODAS" ||
          (filter === "PENDIENTES"
            ? task.status === "PENDIENTE"
            : task.status === "FINALIZADA"),
      ),
    [tasks, filter],
  );
  const unsynced = tasks.filter(
    (task) => task.syncStatus === "PENDIENTE",
  ).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.title}>SIGMA Mantenimiento</Text>
          <Text style={styles.subtitle}>
            Persistencia local con AsyncStorage
          </Text>
          <Text style={styles.pending}>
            {unsynced} cambio(s) pendiente(s) de sincronización
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nueva tarea</Text>
          <View style={styles.row}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              onSubmitEditing={add}
              placeholder="Ej. Revisar impresora del laboratorio"
              style={styles.input}
            />
            <Pressable onPress={add} style={styles.addButton}>
              <Text style={styles.addText}>Agregar</Text>
            </Pressable>
          </View>
          <Text style={styles.help}>
            En esta etapa todo se guarda en el teléfono. La API se conectará
            después.
          </Text>
        </View>

        <View style={styles.filters}>
          {(["TODAS", "PENDIENTES", "FINALIZADAS"] as Filter[]).map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filter, filter === item && styles.filterActive]}
            >
              <Text style={filter === item && styles.filterTextActive}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay tareas en este filtro.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                onPress={async () => {
                  await toggleTask(item.id);
                  await refresh();
                }}
                style={[
                  styles.check,
                  item.status === "FINALIZADA" && styles.checkDone,
                ]}
              >
                <Text style={styles.checkText}>
                  {item.status === "FINALIZADA" ? "✓" : ""}
                </Text>
              </Pressable>
              <View style={styles.taskBody}>
                <Text
                  style={[
                    styles.taskTitle,
                    item.status === "FINALIZADA" && styles.done,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.meta}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
                <Text style={styles.sync}>● {item.syncStatus}</Text>
              </View>
              <Pressable
                onPress={() =>
                  Alert.alert("Eliminar tarea", `¿Eliminar “${item.title}”?`, [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Eliminar",
                      style: "destructive",
                      onPress: async () => {
                        await removeTask(item.id);
                        await refresh();
                      },
                    },
                  ])
                }
              >
                <Text style={styles.delete}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F7FB" },
  header: { backgroundColor: "#183B5B", padding: 20 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#D8E8F5", marginTop: 4 },
  pending: { color: "#FFD166", marginTop: 8, fontWeight: "700" },
  form: { margin: 14, padding: 14, backgroundColor: "#FFF", borderRadius: 10 },
  label: { fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 7,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#2E75B6",
    borderRadius: 7,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  addText: { color: "#FFF", fontWeight: "700" },
  help: { color: "#64748B", fontSize: 12, marginTop: 9 },
  filters: {
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  filter: {
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#AAB8C5",
  },
  filterActive: { backgroundColor: "#2E75B6", borderColor: "#2E75B6" },
  filterTextActive: { color: "#FFF", fontWeight: "700" },
  list: { padding: 14, gap: 8 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 9,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#2E75B6",
    justifyContent: "center",
    alignItems: "center",
  },
  checkDone: { backgroundColor: "#2E75B6" },
  checkText: { color: "#FFF", fontWeight: "700" },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "700" },
  done: { color: "#64748B", textDecorationLine: "line-through" },
  meta: { color: "#64748B", fontSize: 11, marginTop: 2 },
  sync: { color: "#C55A11", fontSize: 11, fontWeight: "700", marginTop: 3 },
  delete: { color: "#C00000", fontSize: 12 },
  empty: { textAlign: "center", color: "#64748B", padding: 28 },
});
