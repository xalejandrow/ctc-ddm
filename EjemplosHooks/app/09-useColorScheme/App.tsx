import { Text, useColorScheme, View } from "react-native";

export default function App09() {
  const scheme = useColorScheme();
  const oscuro = scheme === "dark";
//   const oscuro = scheme === "light";

console.log(oscuro);
  return (
    
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: oscuro ? "#111" : "#fff",
      }}
    >
      <Text style={{ color: oscuro ? "#fff" : "#111" }}>
        Tema detectado: {scheme}
      </Text>
    </View>
  );
}
