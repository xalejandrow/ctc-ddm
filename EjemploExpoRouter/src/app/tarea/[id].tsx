import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
export default function Detalle() {
  const { id, titulo } = useLocalSearchParams<{
    id: string;
    titulo?: string;
  }>();
  return (
    <View style={{ padding: 24 }}>
      <Text>Tarea #{id}</Text>
      <Text>{titulo ?? "Sin título"}</Text>
    </View>
  );
}
