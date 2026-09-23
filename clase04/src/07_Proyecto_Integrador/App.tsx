import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Prioridad = "Baja" | "Media" | "Alta";
type EstadoOrden = "Pendiente" | "En proceso" | "Finalizada";
type Orden = {
  id: string;
  equipo: string;
  problema: string;
  prioridad: Prioridad;
  estado: EstadoOrden;
};

const ordenes: Orden[] = [
  {
    id: "OT-1042",
    equipo: "Notebook Dell Latitude",
    problema: "No inicia el sistema",
    prioridad: "Alta",
    estado: "En proceso",
  },
  {
    id: "OT-1041",
    equipo: "Impresora HP LaserJet",
    problema: "Atasco frecuente de papel",
    prioridad: "Media",
    estado: "Pendiente",
  },
  {
    id: "OT-1039",
    equipo: "Switch Cisco 24 puertos",
    problema: "Revisión preventiva",
    prioridad: "Baja",
    estado: "Finalizada",
  },
  {
    id: "OT-1040",
    equipo: "Router Cisco RV340",
    problema: "Revisión preventiva",
    prioridad: "Baja",
    estado: "Finalizada",
  },
];

function Indicador({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <View style={styles.indicator}>
      <Text style={styles.number}>{valor}</Text>
      <Text style={styles.label}>{etiqueta}</Text>
    </View>
  );
}

function TarjetaOrden({ orden }: { orden: Orden }) {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{orden.id}</Text>
        <Text style={styles.status}>{orden.estado}</Text>
      </View>
      <Text style={styles.equipment}>{orden.equipo}</Text>
      <Text style={styles.problem}>{orden.problema}</Text>
      <Text style={styles.priority}>Prioridad: {orden.prioridad}</Text>
    </View>
  );
}

export default function App07() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>SIGMA</Text>
        <Text style={styles.title}>Órdenes de mantenimiento</Text>
        <Text style={styles.subtitle}>Seguimiento del trabajo técnico.</Text>

        <View style={styles.summary}>
          <Indicador valor="6" etiqueta="Pendientes" />
          <Indicador valor="3" etiqueta="En proceso" />
          {/* <Indicador valor="2" etiqueta="Finalizadas" /> */}
        </View>

        <Text style={styles.section}>Órdenes recientes</Text>
        <View style={styles.list}>
          {ordenes.map((orden) => (
            <TarjetaOrden key={orden.id} orden={orden} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F7FA" },
  content: { padding: 20, paddingBottom: 40 },
  brand: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#2878B5",
  },
  title: { marginTop: 6, fontSize: 30, fontWeight: "700", color: "#17324D" },
  subtitle: { marginTop: 6, fontSize: 16, color: "#5A6F82" },
  summary: { marginTop: 24, flexDirection: "row", gap: 12 },
  indicator: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  number: { fontSize: 30, fontWeight: "800", color: "#2878B5" },
  label: { marginTop: 4, color: "#5A6F82" },
  section: { marginTop: 28, fontSize: 20, fontWeight: "700", color: "#17324D" },
  list: { marginTop: 12, gap: 12 },
  orderCard: {
    padding: 17,
    borderWidth: 1,
    borderColor: "#D9E3EC",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  orderId: { fontSize: 13, fontWeight: "800", color: "#2878B5" },
  status: { fontSize: 13, fontWeight: "700", color: "#D97832" },
  equipment: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#17324D",
  },
  problem: { marginTop: 5, color: "#5A6F82" },
  priority: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#17324D",
  },
});
