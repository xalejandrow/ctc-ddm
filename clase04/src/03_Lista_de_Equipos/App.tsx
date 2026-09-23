import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const equipos = [
  {
    id: "EQ-001",
    nombre: "Notebook Dell Latitude",
    ubicacion: "Administración",
  },
  { id: "EQ-002", nombre: "Impresora HP LaserJet", ubicacion: "Contaduría" },
  {
    id: "EQ-003",
    nombre: "Switch Cisco 24 puertos",
    ubicacion: "Sala de servidores",
  },
  {
    id: "EQ-004",
    nombre: "Rourter MikroTik RB2011",
    ubicacion: "Sala de servidores",
  },
  {
    id: "EQ-005",
    nombre: "Access Point Ubiquiti UniFi",
    ubicacion: "Sala de servidores",
  },
  {
    id: "EQ-006",
    nombre: "Access Point Ubiquiti UniFi",
    ubicacion: "Sala de servidores",
  },
];

export default function App03() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Equipos</Text>
      <View style={styles.list}>
        {equipos.map((equipo) => (
          <View key={equipo.id} style={styles.card}>
            <Text style={styles.code}>{equipo.id}</Text>
            <Text style={styles.name}>{equipo.nombre}</Text>
            <Text style={styles.location}>{equipo.ubicacion}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#F4F7FA" },
  title: { marginTop: 18, fontSize: 30, fontWeight: "700", color: "#17324D" },
  list: { marginTop: 20, gap: 12 },
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#D9E3EC",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  code: { fontSize: 12, fontWeight: "800", letterSpacing: 1, color: "#2878B5" },
  name: { marginTop: 6, fontSize: 18, fontWeight: "700", color: "#17324D" },
  location: { marginTop: 5, fontSize: 15, color: "#5A6F82" },
});
