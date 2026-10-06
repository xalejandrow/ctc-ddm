import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTasks } from "../../src/context/TaskContext";

export default function NewTaskScreen() {
  const { create } = useTasks();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return Alert.alert("Campo obligatorio", "Ingresá una descripción para la tarea.");
    try {
      setSaving(true);
      const task = await create(cleanTitle);
      router.replace(`/task/${task.id}`);
    } catch (err) {
      Alert.alert("No se pudo crear", err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  return <View style={styles.container}>
    <Text style={styles.label}>Descripción de la tarea</Text>
    <TextInput value={title} onChangeText={setTitle} placeholder="Ej.: Revisar filtro del compresor" style={styles.input} multiline autoFocus />
    <Text style={styles.help}>Se enviará un POST como JSON a la API de práctica.</Text>
    <Pressable style={[styles.button, saving && styles.disabled]} onPress={save} disabled={saving}><Text style={styles.buttonText}>{saving ? "Guardando..." : "Crear tarea"}</Text></Pressable>
  </View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 20, gap: 10 }, label: { fontWeight: "700", color: "#17365D" }, input: { backgroundColor: "white", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 8, minHeight: 110, padding: 12, textAlignVertical: "top" }, help: { color: "#52616B", fontSize: 13, marginBottom: 10 }, button: { backgroundColor: "#17365D", borderRadius: 8, alignItems: "center", padding: 14 }, disabled: { opacity: .6 }, buttonText: { color: "white", fontWeight: "800" } });
