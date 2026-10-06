import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
const tareas = ["Revisar impresora", "Actualizar router", "Limpiar teclado"];
export default function App05() {
  const [busqueda, setBusqueda] = useState("");
  const filtradas = useMemo(
    () =>
      tareas.filter((t) => t.toLowerCase().includes(busqueda.toLowerCase())),
    [busqueda],
  );
  return (
    <View style={{ padding: 24, gap: 10 }}>
      <TextInput
        placeholder="Buscar tarea"
        value={busqueda}
        onChangeText={setBusqueda}
        style={{ borderWidth: 1, padding: 10 }}
      />
      {filtradas.map((t) => (
        <Text key={t}>• {t}</Text>
      ))}
    </View>
  );
}
