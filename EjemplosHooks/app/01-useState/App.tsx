import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function App01() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("Aún no hay un equipo seleccionado");
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <TextInput
        placeholder="Nombre del equipo"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />
      <Button
        title="Seleccionar"
        onPress={() => setMensaje(`Equipo: ${nombre || "sin nombre"}`)}
      />
      <Text>{mensaje}</Text>
    </View>
  );
}
