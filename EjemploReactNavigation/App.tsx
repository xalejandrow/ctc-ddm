import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { Button, Text, View } from "react-native";
const Stack = createNativeStackNavigator();
function Inicio() {
  const navigation = useNavigation<any>();
  return (
    <View style={{ padding: 24 }}>
      <Button
        title="Abrir equipo"
        onPress={() =>
          navigation.navigate("Detalle", { nombre: "Router laboratorio" })
        }
      />
    </View>
  );
}
function Detalle() {
  const route = useRoute<any>();
  const [visitas, setVisitas] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setVisitas((n) => n + 1);
    }, []),
  );
  return (
    <View style={{ padding: 24 }}>
      <Text>{route.params.nombre}</Text>
      <Text>Enfoques: {visitas}</Text>
    </View>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Detalle" component={Detalle} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
