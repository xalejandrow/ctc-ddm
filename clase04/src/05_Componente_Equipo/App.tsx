import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EquipoProps = {
  codigo: string;
  nombre: string;
  ubicacion: string;
  responsable: string;
};

function TarjetaEquipo({
  codigo,
  nombre,
  ubicacion,
  responsable,
}: EquipoProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.code}>{codigo}</Text>
      <Text style={styles.name}>{nombre}</Text>
      <Text style={styles.detail}>Ubicación: {ubicacion}</Text>
      <Text style={styles.detail}>Responsable: {responsable}</Text>
    </View>
  );
}

export default function App05() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Inventario</Text>
      <View style={styles.list}>
        <TarjetaEquipo
          codigo="EQ-001"
          nombre="Notebook Dell Latitude"
          ubicacion="Administración"
          responsable="Ana Silva"
        />
        <TarjetaEquipo
          codigo="EQ-002"
          nombre="Impresora HP LaserJet"
          ubicacion="Contaduría"
          responsable="Mario López"
        />
        <TarjetaEquipo
          codigo="EQ-003"
          nombre="Switch Cisco 24 puertos"
          ubicacion="Sala de servidores"
          responsable="Carlos Rodríguez"
        />
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
    // borderWidth: 15,
    // borderColor: "#f10e0e",
    borderLeftWidth: 5,
    borderLeftColor: "#2878B5",
    // borderRightWidth: 5,
    // borderRightColor: "#2878B5",
    // borderTopWidth: 5,
    // borderTopColor: "#2878B5",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  code: { fontSize: 12, fontWeight: "800", color: "#2878B5" },
  name: { marginTop: 6, fontSize: 18, fontWeight: "700", color: "#17324D" },
  detail: { marginTop: 5, fontSize: 14, color: "#5A6F82" },
});
