import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
export default function LoginScreen() {
  const [email, setEmail] = useState("supervisor@sigma.local");
  const [password, setPassword] = useState("sigma123");
  const { login, loading } = useAuth();
  async function submit() {
    try {
      await login(email, password);
      router.replace("/tasks");
    } catch (e) {
      Alert.alert(
        "Ingreso",
        e instanceof Error ? e.message : "Error al iniciar sesión",
      );
    }
  }
  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.title}>SIGMA</Text>
      <Text style={styles.subtitle}>Tareas, incidencias y ubicación</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña"
      />
      <Button
        title={loading ? "Ingresando..." : "Ingresar"}
        disabled={loading}
        onPress={submit}
      />
      <Text style={styles.help}>
        Prueba: supervisor@sigma.local o tecnico@sigma.local{`\n`}Contraseña:
        sigma123
      </Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#f4f7fb",
  },
  title: { fontSize: 38, fontWeight: "800", color: "#174a7c" },
  subtitle: { fontSize: 16, marginBottom: 18 },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccd5df",
    borderRadius: 8,
    padding: 12,
  },
  help: { marginTop: 12, color: "#52616b", textAlign: "center" },
});
