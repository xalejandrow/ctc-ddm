import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App06() {
  const { width } = useWindowDimensions();
  const pantallaAmplia = width >= 600;

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Panel SIGMA</Text>
      <Text style={styles.info}>Ancho disponible: {Math.round(width)} px</Text>

      <View style={[styles.grid, pantallaAmplia && styles.gridWide]}>
        <View style={styles.card}>
          <Text style={styles.value}>6</Text>
          <Text style={styles.label}>Pendientes</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.value}>2</Text>
          <Text style={styles.label}>Urgentes</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.value}>14</Text>
          <Text style={styles.label}>Finalizadas</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#F4F7FA" },
  title: { marginTop: 18, fontSize: 29, fontWeight: "700", color: "#17324D" },
  info: { marginTop: 7, color: "#5A6F82" },
  grid: { marginTop: 24, gap: 12 },
  gridWide: { flexDirection: "row" },
  card: {
    flex: 1,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  value: { fontSize: 36, fontWeight: "800", color: "#2878B5" },
  label: { marginTop: 4, fontSize: 15, color: "#5A6F82" },
});
