import { StyleSheet, Text, View } from "react-native";
import { Task, User } from "../types";
import { AppButton } from "./AppButton";
type Props = {
  task: Task;
  user: User;
  onEdit: () => void;
  onClaim: () => void;
  onRelease: () => void;
  onDelete: () => void;
};
export function TaskCard({
  task,
  user,
  onEdit,
  onClaim,
  onRelease,
  onDelete,
}: Props) {
  const isOwn = task.assignedTo === user.id;
  const isFree = task.assignedTo === null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      {task.description ? (
        <Text style={styles.description}>{task.description}</Text>
      ) : null}
      <Text style={styles.meta}>Estado: {task.status}</Text>
      <Text style={styles.meta}>
        Asignada a: {task.technicianName ?? "Sin asignar"}
      </Text>
      <View style={styles.actions}>
        {(user.role === "SUPERVISOR" || isOwn) && (
          <AppButton title="Editar" onPress={onEdit} color="secondary" />
        )}
        {user.role === "TECNICO" && isFree && task.status !== "FINALIZADA" && (
          <AppButton title="Tomar tarea" onPress={onClaim} />
        )}
        {user.role === "TECNICO" && isOwn && (
          <AppButton title="Liberar" onPress={onRelease} color="secondary" />
        )}
        {user.role === "SUPERVISOR" && (
          <AppButton title="Eliminar" onPress={onDelete} color="danger" />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D6E0EA",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    gap: 5,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#102A43" },
  description: { color: "#40566D" },
  meta: { color: "#0F8B8D", fontSize: 13 },
  actions: { gap: 8, marginTop: 8 },
});
