import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

const URL = "https://jsonplaceholder.typicode.com/todos/1";

export default function App() {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTodo() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`El servidor respondió con ${response.status}`);
      }

      const data: Todo = await response.json();
      setTodo(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible cargar los datos",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTodo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>API REST básica</Text>
      <Text style={styles.subtitle}>GET /todos/1 con fetch y async await</Text>

      {loading && <ActivityIndicator size="large" color="#1E5B9B" />}

      {error && (
        <View style={styles.message}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.button} onPress={loadTodo}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {todo && !loading && (
        <View style={styles.card}>
          <Text style={styles.label}>Respuesta JSON convertida a objeto</Text>
          <Text style={styles.todoTitle}>{todo.title}</Text>
          <Text>Identificador: {todo.id}</Text>
          <Text>Estado: {todo.completed ? "Realizada" : "Pendiente"}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FB", padding: 24, gap: 18, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#17365D" },
  subtitle: { fontSize: 16, color: "#52616B" },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    gap: 10,
    elevation: 2,
  },
  label: { color: "#52616B", fontSize: 13, fontWeight: "600" },
  todoTitle: { fontSize: 20, fontWeight: "700", textTransform: "capitalize" },
  message: { alignItems: "flex-start", gap: 12 },
  error: { color: "#B42318", fontSize: 16 },
  button: {
    backgroundColor: "#1E5B9B",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "700" },
});
