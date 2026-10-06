import { memo, useCallback, useState } from "react";
import { Button, Text, View } from "react-native";
const Item = memo(({ guardar }: { guardar: () => void }) => (
  <Button title="Guardar tarea" onPress={guardar} />
));
export default function App06() {
  const [contador, setContador] = useState(0);
  const guardar = useCallback(() => console.log("Tarea guardada"), []);
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text>Render: {contador}</Text>
      <Button
        title="Cambiar contador"
        onPress={() => setContador((n) => n + 1)}
      />
      <Item guardar={guardar} />
    </View>
  );
}
