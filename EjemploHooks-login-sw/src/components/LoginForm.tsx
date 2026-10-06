import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export function LoginForm() {
  const { iniciarSesion } = useAuth();
  // useState guarda los valores controlados de los campos y el posible mensaje de error.
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  // useRef permite enfocar el segundo campo sin provocar un renderizado.
  const claveRef = useRef<TextInput>(null);

  const ingresar = () => {
    const esValido = iniciarSesion(nombreUsuario, clave);
    setError(esValido ? "" : "Usuario o clave incorrectos.");
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Login Star Wars</Text>
      <Text style={styles.ayuda}>Prueba: leia / rebeldes</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Usuario"
        returnKeyType="next"
        style={styles.campo}
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
        onSubmitEditing={() => claveRef.current?.focus()}
      />
      <TextInput
        ref={claveRef}
        secureTextEntry
        placeholder="Clave"
        returnKeyType="done"
        style={styles.campo}
        value={clave}
        onChangeText={setClave}
        onSubmitEditing={ingresar}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Ingresar" onPress={ingresar} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  titulo: { fontSize: 26, fontWeight: "700" },
  ayuda: { color: "#4b5563" },
  campo: { borderWidth: 1, borderColor: "#9ca3af", borderRadius: 8, padding: 12 },
  error: { color: "#b91c1c" },
});
