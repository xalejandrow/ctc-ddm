import { StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "./src/components/LoginForm";
import { PeliculasList } from "./src/components/PeliculasList";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

function Contenido() {
  // useContext se consume dentro de useAuth para decidir que pantalla mostrar.
  const { usuarioActivo } = useAuth();
  return usuarioActivo ? <PeliculasList /> : <LoginForm />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.pantalla}>
        <Contenido />
        <StatusBar />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
