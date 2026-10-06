import { useRef } from "react";
import { Button, TextInput, View } from "react-native";

export default function App04() {
  const descripcionRef = useRef<TextInput>(null);
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <TextInput
        placeholder="Nombre de tarea"
        style={{ borderWidth: 1, padding: 10 }}
      />
      <TextInput
        ref={descripcionRef}
        placeholder="Descripción"
        style={{ borderWidth: 1, padding: 10 }}
      />
      <Button
        title="Ir a descripción"
        onPress={() => descripcionRef.current?.focus()}
      />
    </View>
  );
}
