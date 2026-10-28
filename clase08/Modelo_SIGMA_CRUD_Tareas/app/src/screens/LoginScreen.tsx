import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { useAuth } from "../context/AuthContext";
export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("supervisor@sigma.test");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert("Login inválido", e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SIGMA</Text>
        <Text style={styles.subtitle}>Gestión de tareas</Text>
        <Text style={styles.help}>
          Supervisor: supervisor@sigma.test{`\n`}Técnico: tecnico@sigma.test
          {`\n`}Contraseña: 123456
        </Text>
        <AppInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Correo"
        />
        <AppInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña"
        />
        <AppButton
          title={loading ? "Ingresando..." : "Ingresar"}
          onPress={submit}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F6F9FC",
  },
  content: { gap: 13 },
  title: { fontSize: 36, fontWeight: "700", color: "#102A43" },
  subtitle: { fontSize: 22, fontWeight: "700", color: "#0F8B8D" },
  help: { color: "#52667A", lineHeight: 20, marginBottom: 8 },
});
