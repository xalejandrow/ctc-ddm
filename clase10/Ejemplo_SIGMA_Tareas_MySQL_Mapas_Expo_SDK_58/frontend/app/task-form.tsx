import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { request } from "@/services/http";
import { Task, TaskPayload } from "@/types/task";
import { useAuth } from "@/context/AuthContext";
import {
  DeviceLocation,
  MAX_ACCURACY_METERS,
} from "@/services/locationService";
import { LocationPicker } from "@/components/LocationPicker";
import { TaskMap } from "@/components/TaskMap";
export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [saving, setSaving] = useState(false);
  const edit = Boolean(id);
  useEffect(() => {
    if (!id) return;
    request<Task>(`/tasks/${id}`)
      .then((data) => {
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || "");
        if (data.latitude !== null && data.longitude !== null)
          setLocation({
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            accuracy:
              data.location_accuracy === null
                ? null
                : Number(data.location_accuracy),
            capturedAt: data.location_captured_at || new Date().toISOString(),
          });
      })
      .catch((e) => Alert.alert("Tarea", e.message));
  }, [id]);
  const canEdit =
    !task || user?.role === "SUPERVISOR" || task.assigned_to === user?.id;
  async function save() {
    if (!title.trim()) return Alert.alert("Validación", "Ingresá un título.");
    if (location?.accuracy && location.accuracy > MAX_ACCURACY_METERS)
      return Alert.alert(
        "Precisión insuficiente",
        `La precisión actual es ±${Math.round(location.accuracy)} m. Volvé a obtener la ubicación antes de guardar.`,
      );
    const payload: TaskPayload = {
      title,
      description,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      locationAccuracy: location?.accuracy ?? null,
      locationCapturedAt: location?.capturedAt ?? null,
    };
    setSaving(true);
    try {
      if (id)
        await request(`/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      else
        await request("/tasks", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      router.back();
    } catch (e) {
      Alert.alert("Guardar", e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }
  async function release() {
    try {
      await request(`/tasks/${id}/release`, { method: "POST" });
      router.back();
    } catch (e) {
      Alert.alert("Liberar", e instanceof Error ? e.message : "Error");
    }
  }
  if (edit && !task)
    return (
      <SafeAreaView style={styles.page}>
        <Text>Cargando tarea...</Text>
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          editable={canEdit}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ej.: Revisión de luminaria"
        />
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          editable={canEdit}
          multiline
          style={[styles.input, styles.description]}
          value={description}
          onChangeText={setDescription}
          placeholder="Detalle de la incidencia"
        />
        {canEdit ? (
          <LocationPicker value={location} onChange={setLocation} />
        ) : (
          task && (
            <>
              <Text style={styles.label}>Ubicación registrada</Text>
              <TaskMap tasks={[task]} />
            </>
          )
        )}
        {task && (
          <View style={styles.details}>
            <Text>Estado: {task.status}</Text>
            <Text>Asignada a: {task.assigned_name || "Sin asignar"}</Text>
            <Text>Creada por: {task.creator_name}</Text>
          </View>
        )}
        {canEdit && (
          <Button
            title={saving ? "Guardando..." : "Guardar tarea"}
            disabled={saving}
            onPress={save}
          />
        )}
        {task &&
          (user?.role === "SUPERVISOR" || task.assigned_to === user?.id) && (
            <Button title="Liberar tarea" color="#a65118" onPress={release} />
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f4f7fb" },
  content: { padding: 14, gap: 9 },
  label: { fontWeight: "700" },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccd5df",
    borderRadius: 8,
    padding: 12,
  },
  description: { minHeight: 90, textAlignVertical: "top" },
  details: { backgroundColor: "#e8eef5", padding: 12, borderRadius: 8, gap: 4 },
});
