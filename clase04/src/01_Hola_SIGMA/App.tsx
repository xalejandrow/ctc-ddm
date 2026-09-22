import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App01() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.brand}>SIGMA</Text>
        <Text style={styles.title}>Gestión de mantenimiento</Text>
        <Text style={styles.description}>
          Controle equipos, incidencias y órdenes de trabajo.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F7FA" },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  brand: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#2878B5",
  },
  title: { marginTop: 8, fontSize: 29, fontWeight: "700", color: "#17324D" },
  description: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 23,
    color: "#5A6F82",
  },
});
