import { useReducer } from "react";
import { Button, Text, View } from "react-native";
type Estado = { cantidad: number };
type Accion = { type: "sumar" | "restar" };
function reducer(estado: Estado, accion: Accion): Estado {
  return {
    cantidad:
      accion.type === "sumar"
        ? estado.cantidad + 1
        : Math.max(0, estado.cantidad - 1),
  };
}
export default function App07() {
  const [estado, dispatch] = useReducer(reducer, { cantidad: 0 });
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text>Repuestos en stock: {estado.cantidad}</Text>
      <Button title="Sumar" onPress={() => dispatch({ type: "sumar" })} />
      <Button title="Restar" onPress={() => dispatch({ type: "restar" })} />
    </View>
  );
}
