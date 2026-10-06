import { Link, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
export default function Inicio() {
  const router = useRouter();
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text>Inicio SIGMA</Text>
      <Button
        title="Ver tarea 1"
        onPress={() =>
          router.push({
            pathname: "/tarea/[id]",
            params: { id: "1", titulo: "Revisar impresora" },
          })
        }
      />
      <Link href="/tarea/2">Abrir tarea 2</Link>
    </View>
  );
}
