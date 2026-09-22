import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App02() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.brand}>SIGMA</Text>
      <Text style={styles.title}>Resumen de mantenimiento</Text>

      <View style={styles.cards}>
        <View style={[styles.card, styles.blue]}>
          <Text style={styles.value}>28</Text>
          <Text style={styles.label}>Equipos registrados</Text>
        </View>
        <View style={[styles.card, styles.orange]}>
          <Text style={styles.value}>6</Text>
          <Text style={styles.label}>Órdenes pendientes</Text>
        </View>
        <View style={[styles.card, styles.green]}>
          <Text style={styles.value}>14</Text>
          <Text style={styles.label}>Mantenimientos finalizados</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#F4F7FA" },
  brand: {
    marginTop: 18,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#2878B5",
  },
  title: { marginTop: 7, fontSize: 28, fontWeight: "700", color: "#17324D" },
  cards: { marginTop: 26, gap: 12 },
  card: {
    minHeight: 110,
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
  },
  blue: { backgroundColor: "#2878B5" },
  orange: { backgroundColor: "#D97832" },
  green: { backgroundColor: "#2E8266" },
  value: { fontSize: 32, fontWeight: "800", color: "#FFFFFF" },
  label: { marginTop: 4, fontSize: 16, color: "#FFFFFF" },
});
