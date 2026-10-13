import NetInfo from "@react-native-community/netinfo";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
import { createTask, init, listTasks, Task, toggleTask } from "./src/database";
import { synchronize } from "./src/sync";
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [online, setOnline] = useState(false);
  const refresh = async () => setTasks(await listTasks());
  useEffect(() => {
    init().then(refresh);
    
    return NetInfo.addEventListener((s) =>
      setOnline(Boolean(s.isConnected && s.isInternetReachable !== false)),
    );
  }, []);
  const add = async () => {
    if (!title.trim()) return;
    await createTask(title.trim());
    setTitle("");
    refresh();
  };
  const sync = async () => {
    const r = await synchronize();
    
    const state = await NetInfo.fetch();
    console.info('NetInfo.fetch()', state);
    
    await refresh();
    Alert.alert("Sincronización", r.message);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.screen}>
        <StatusBar style="light" />
        <View style={s.header}>
          <Text style={s.title}>SIGMA · Opción 2</Text>
          <Text style={s.sub}>
            {online ? "● Online" : "● Offline"} · SQLite local + cola durable
          </Text>
          <Pressable style={s.sync} onPress={sync}>
            <Text style={s.syncText}>Sincronizar</Text>
          </Pressable>
        </View>
        <View style={s.form}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Nueva tarea"
            style={s.input}
          />
          <Pressable style={s.add} onPress={add}>
            <Text style={s.white}>Agregar</Text>
          </Pressable>
        </View>
        <FlatList
          contentContainerStyle={s.list}
          data={tasks}
          keyExtractor={(x) => x.id}
          renderItem={({ item }) => (
            <Pressable
              style={s.card}
              onPress={async () => {
                await toggleTask(item);
                refresh();
              }}
            >
              <Text style={item.status === "FINALIZADA" ? s.done : s.task}>
                {item.status === "FINALIZADA" ? "✓ " : "○ "}
                {item.title}
              </Text>
              <Text style={item.syncStatus === "SINCRONIZADA" ? s.ok : s.wait}>
                {item.syncStatus}
              </Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f7fb" },
  header: { backgroundColor: "#183b5b", padding: 20 },
  title: { color: "white", fontSize: 23, fontWeight: "700" },
  sub: { color: "#d8e8f5", marginTop: 5 },
  sync: {
    marginTop: 12,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  syncText: { color: "#183b5b", fontWeight: "700" },
  form: { padding: 14, flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 10,
    borderRadius: 7,
  },
  add: {
    backgroundColor: "#2e75b6",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 7,
  },
  white: { color: "white", fontWeight: "700" },
  list: { padding: 14, gap: 8 },
  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  task: { fontWeight: "700" },
  done: { color: "#64748b", textDecorationLine: "line-through" },
  ok: { color: "#2e7d32", fontSize: 11, fontWeight: "700" },
  wait: { color: "#c55a11", fontSize: 11, fontWeight: "700" },
});
