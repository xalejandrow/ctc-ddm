import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EstadoProps = {
  texto: string;
  variante: "operativo" | "mantenimiento" | "fueraServicio";
};

function EstadoEquipo({ texto, variante }: EstadoProps) {
  return (
    <View style={[styles.badge, styles[variante]]}>
      <Text style={styles.badgeText}>{texto}</Text>
    </View>
  );
}

export default function App04() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Estados de equipos</Text>
      <View style={styles.row}>
        <EstadoEquipo texto="Operativo" variante="operativo" />
        <EstadoEquipo texto="En mantenimiento" variante="mantenimiento" />
        <EstadoEquipo texto="Fuera de servicio" variante="fueraServicio" />
        <EstadoEquipo texto="TEST" variante="fueraServicio" />
        <EstadoEquipo texto="TEST2" variante="mantenimiento" />
        <EstadoEquipo texto="En mantenimiento" variante="mantenimiento" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#F4F7FA" },
  title: { marginTop: 18, fontSize: 27, fontWeight: "700", color: "#17324D" },
  row: { marginTop: 24, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99 },
  operativo: { backgroundColor: "#DDF1E9" },
  mantenimiento: { backgroundColor: "#FBE6CA" },
  fueraServicio: { backgroundColor: "#F7D7D9" },
  badgeText: { fontWeight: "700", color: "#17324D" },
});
