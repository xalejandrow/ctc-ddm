import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { RootScreen } from "./src/screens/RootScreen";
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootScreen />
        <StatusBar style="dark" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
