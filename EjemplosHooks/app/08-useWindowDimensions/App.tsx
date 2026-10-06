import { Text, useWindowDimensions, View } from "react-native";

export default function App08() {
  const { width } = useWindowDimensions();
  const dosColumnas = width >= 600;
//   const dosColumnas = width >= 300;
  return (
    <View
      style={{
        padding: 24,
        flexDirection: dosColumnas ? "row" : "column",
        gap: 12,
      }}
    >
      <View style={{ flex: 1, padding: 20, backgroundColor: "#dff3ff" }}>
        <Text>Equipos</Text>
      </View>
      <View style={{ flex: 1, padding: 20, backgroundColor: "#e6f8e9" }}>
        <Text>Tareas</Text>
      </View>
    </View>
  );
}
