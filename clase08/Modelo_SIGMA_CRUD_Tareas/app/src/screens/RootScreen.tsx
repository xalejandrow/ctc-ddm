import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { LoginScreen } from "./LoginScreen";
import { TasksScreen } from "./TasksScreen";
export function RootScreen() {
  const { user, restoring } = useAuth();
  if (restoring)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  return user ? <TasksScreen /> : <LoginScreen />;
}
const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
