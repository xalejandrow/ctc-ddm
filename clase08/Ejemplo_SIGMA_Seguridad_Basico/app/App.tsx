import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  // SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

// Android Emulator: http://10.0.2.2:4000
// iOS Simulator: http://localhost:4000
// Celular físico: http://IP_LOCAL_DE_TU_PC:4000
// const API_URL = "http://10.0.2.2:4000";
// const API_URL = "http://192.168.0.101:4000";
const API_URL = "http://192.168.88.23:4000";

type User = { id: number; name: string; email: string; role: string };
type Task = {
  id: number;
  title: string;
  assignedTo: number | null;
  status: string;
};

export default function App() {
  const [email, setEmail] = useState("tecnico@sigma.test");
  const [password, setPassword] = useState("123456");
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        Alert.alert("No se pudo iniciar sesión", data.message);
        return;
      }

      // El token se guarda en el almacenamiento seguro del dispositivo.
      await SecureStore.setItemAsync("accessToken", data.token);
      setUser(data.user);
      await loadTasks(data.token);
    } catch {
      Alert.alert(
        "Error de red",
        "Verifica que el backend esté levantado y que API_URL sea correcta.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadTasks(token?: string) {
    const accessToken =
      token ?? (await SecureStore.getItemAsync("accessToken"));
    if (!accessToken) return;

    const response = await fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();

    if (response.status === 401) {
      await logout();
      Alert.alert("Sesión vencida", data.message);
      return;
    }
    if (!response.ok) {
      Alert.alert("Error", data.message ?? "No se pudieron cargar las tareas.");
      return;
    }
    setTasks(data);
  }

  async function assignTask() {
    const token = await SecureStore.getItemAsync("accessToken");
    const response = await fetch(`${API_URL}/tasks/2/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tecnicoId: 1 }),
    });
    const data = await response.json();

    if (response.status === 403) {
      Alert.alert("Acceso denegado (403)", data.message);
      return;
    }
    if (!response.ok) {
      Alert.alert("Error", data.message);
      return;
    }
    Alert.alert(
      "Tarea asignada",
      "La autorización del backend permitió la acción.",
    );
    await loadTasks();
  }

  async function logout() {
    await SecureStore.deleteItemAsync("accessToken");
    setUser(null);
    setTasks([]);
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>SIGMA · Inicio de sesión</Text>
        <Text style={styles.help}>
          Prueba: tecnico@sigma.test o supervisor@sigma.test. Contraseña: 123456
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Correo"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña"
        />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Ingresar" onPress={login} />
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hola, {user.name}</Text>
      <Text style={styles.role}>Rol: {user.role}</Text>
      <View style={styles.separator} />
      <Text style={styles.subtitle}>Tareas protegidas</Text>
      {tasks.map((task) => (
        <Text key={task.id} style={styles.task}>
          • {task.title} · {task.status}
        </Text>
      ))}
      <View style={styles.space} />
      <Button title="Recargar tareas" onPress={() => loadTasks()} />
      <View style={styles.space} />
      <Button title="Asignar tarea 2 al técnico" onPress={assignTask} />
      <Text style={styles.help}>
        Con TÉCNICO verás un 403. Con SUPERVISOR la API permitirá la acción.
      </Text>
      <View style={styles.space} />
      <Button title="Cerrar sesión" color="#B42318" onPress={logout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 14,
    justifyContent: "center",
    backgroundColor: "#F6F9FC",
  },
  title: { fontSize: 28, fontWeight: "700", color: "#102A43" },
  subtitle: { fontSize: 20, fontWeight: "700", color: "#102A43" },
  role: { fontSize: 16, color: "#0F8B8D", fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#B8C6D6",
    borderRadius: 8,
    backgroundColor: "white",
    padding: 12,
    fontSize: 16,
  },
  help: { color: "#52667A", lineHeight: 20 },
  task: { fontSize: 16, color: "#17324D" },
  separator: { height: 1, backgroundColor: "#D6E0EA", marginVertical: 8 },
  space: { height: 4 },
});
