import { createContext, useContext, useState } from "react";
import { Button, Text, View } from "react-native";

const AuthContext = createContext({ usuario: "", iniciar: () => {} });
function Perfil() {
  const { usuario } = useContext(AuthContext);
  return <Text>Usuario: {usuario || "sin sesión"}</Text>;
}
export default function App03() {
  const [usuario, setUsuario] = useState("");
  return (
    <AuthContext.Provider value={{ usuario, iniciar: () => setUsuario("Ana") }}>
      <View style={{ padding: 24, gap: 12 }}>
        <Perfil />
        <Button title="Iniciar sesión" onPress={() => setUsuario("Ana")} />
      </View>
    </AuthContext.Provider>
  );
}
