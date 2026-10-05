import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getTaskById } from "../../data/tasks";

export default function DetalleTareaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = getTaskById(id);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Tarea no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.id}>{task.id}</Text>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.label}>Activo</Text>
      <Text style={styles.value}>{task.asset}</Text>
      <Text style={styles.label}>Prioridad</Text>
      <Text style={styles.value}>{task.priority}</Text>
      <Text style={styles.label}>Descripción</Text>
      <Text style={styles.value}>{task.description}</Text>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({ pathname: "/reporte", params: { tareaId: task.id } })
        }
      >
        <Text style={styles.buttonText}>Ingresar reporte</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#FFFFFF" },
  id: { color: "#1877B9", fontWeight: "800", fontSize: 16 },
  title: {
    color: "#102A43",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 28,
  },
  label: { color: "#52606D", fontSize: 14, fontWeight: "700", marginTop: 16 },
  value: { color: "#102A43", fontSize: 17, marginTop: 4, lineHeight: 24 },
  button: {
    backgroundColor: "#E97A35",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 34,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
