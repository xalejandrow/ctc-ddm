import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { Technician, Task, TaskPayload, TaskStatus, User } from "../types";

type Props = {
  task: Task | null;
  user: User;
  technicians: Technician[];
  onSave: (payload: TaskPayload) => Promise<void>;
  onCancel: () => void;
};
const statuses: TaskStatus[] = ["ABIERTA", "EN_PROCESO", "FINALIZADA"];
export function TaskFormScreen({
  task,
  user,
  technicians,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "ABIERTA");
  const [assignedTo, setAssignedTo] = useState<number | null>(
    task?.assignedTo ?? null,
  );
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "ABIERTA");
    setAssignedTo(task?.assignedTo ?? null);
  }, [task]);
  async function submit() {
    if (!title.trim())
      return Alert.alert("Falta título", "Ingresá un título para la tarea.");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description,
        status,
        ...(user.role === "SUPERVISOR" ? { assignedTo } : {}),
      });
    } catch (e) {
      Alert.alert(
        "No se pudo guardar",
        e instanceof Error ? e.message : "Error",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {task ? "Editar tarea" : "Nueva tarea"}
        </Text>
        <Text style={styles.label}>Título</Text>
        <AppInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ej.: Revisar impresora"
        />
        <Text style={styles.label}>Descripción</Text>
        <AppInput
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Detalle de la tarea"
        />
        <Text style={styles.label}>Estado</Text>
        <View style={styles.options}>
          {statuses.map((item) => (
            <AppButton
              key={item}
              title={item}
              onPress={() => setStatus(item)}
              color={status === item ? "primary" : "secondary"}
            />
          ))}
        </View>
        {user.role === "SUPERVISOR" && (
          <>
            <Text style={styles.label}>Asignación</Text>
            <View style={styles.options}>
              <AppButton
                title={assignedTo === null ? "Sin asignar" : "Liberar tarea"}
                onPress={() => setAssignedTo(null)}
                color={assignedTo === null ? "primary" : "secondary"}
              />
              {technicians.map((technician) => (
                <AppButton
                  key={technician.id}
                  title={technician.name}
                  onPress={() => setAssignedTo(technician.id)}
                  color={assignedTo === technician.id ? "primary" : "secondary"}
                />
              ))}
            </View>
          </>
        )}
        <View style={styles.buttons}>
          <AppButton
            title={saving ? "Guardando..." : "Guardar"}
            onPress={submit}
            disabled={saving}
          />
          <AppButton title="Cancelar" onPress={onCancel} color="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F9FC" },
  content: { padding: 20, gap: 10 },
  title: { fontSize: 26, fontWeight: "700", color: "#102A43", marginBottom: 8 },
  label: { color: "#102A43", fontWeight: "700", marginTop: 6 },
  options: { gap: 8 },
  buttons: { gap: 10, marginTop: 16 },
});
