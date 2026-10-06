import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function App02() {
  const [equipos, setEquipos] = useState<string[]>([]);
  useEffect(() => {
    const cargar = async () => {
      await new Promise((r) => setTimeout(r, 700));
      setEquipos(["Impresora Zebra", "Notebook aula 2", "Router laboratorio"]);
    };
    cargar();
  }, []);
  if (!equipos.length)
    return (
      <View style={{ padding: 24 }}>
        <ActivityIndicator />
      </View>
    );
  return (
    <View style={{ padding: 24 }}>
      {equipos.map((e) => (
        <Text key={e}>• {e}</Text>
      ))}
    </View>
  );
}
