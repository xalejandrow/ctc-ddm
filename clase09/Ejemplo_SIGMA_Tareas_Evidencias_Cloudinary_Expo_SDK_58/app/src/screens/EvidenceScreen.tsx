import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { File } from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../config/api";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { Evidence, Task } from "../types";

type Props = { task: Task; token: string; onBack: () => void };

export function EvidenceScreen({ task, token, onBack }: Props) {
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [description, setDescription] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadEvidences = useCallback(async () => {
    const response = await fetch(`${API_URL}/tasks/${task.id}/evidences`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message ?? "No se pudieron cargar las evidencias.");
    setEvidences(data);
  }, [task.id, token]);

  useEffect(() => {
    loadEvidences().catch((error) => Alert.alert("Error", error.message));
  }, [loadEvidences]);

  async function openCamera() {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted)
        return Alert.alert(
          "Permiso necesario",
          "Sin permiso de cámara no se puede registrar una evidencia.",
        );
    }
    setCameraVisible(true);
  }

  async function takePhoto() {
    const photo = await camera.current?.takePictureAsync({ quality: 0.65 });
    if (photo) {
      setPhotoUri(photo.uri);
      setCameraVisible(false);
    }
  }

  async function upload() {
    if (!photoUri)
      return Alert.alert(
        "Falta foto",
        "Primero tomá una foto de la evidencia.",
      );
    if (!description.trim())
      return Alert.alert(
        "Falta descripción",
        "Explicá qué demuestra esta evidencia.",
      );
    const formData = new FormData();
    formData.append("description", description.trim());
    // Expo SDK 58 exige un Blob/File real: el objeto { uri, name, type } ya no es válido.
    const photoFile = new File(photoUri);
    formData.append("photo", photoFile);
    setUploading(true);
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}/evidences`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message ?? "No se pudo subir la evidencia.");
      setPhotoUri(null);
      setDescription("");
      await loadEvidences();
      Alert.alert(
        "Evidencia registrada",
        "La foto fue subida a Cloudinary y el enlace quedó guardado en MySQL.",
      );
    } catch (error) {
      Alert.alert(
        "Error al subir",
        error instanceof Error ? error.message : "Error desconocido",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Evidencias</Text>
        <Text style={styles.subtitle}>{task.title}</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Descripción de la foto</Text>
        <AppInput
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Ej.: Impresora funcionando luego del cambio de tóner"
        />
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.preview} />
        ) : (
          <Text style={styles.hint}>Aún no seleccionaste una foto.</Text>
        )}
        <AppButton
          title="Abrir cámara"
          onPress={openCamera}
          color="secondary"
        />
        <AppButton
          title={uploading ? "Subiendo..." : "Guardar evidencia"}
          onPress={upload}
          disabled={uploading}
        />
      </View>
      <FlatList
        data={evidences}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.listTitle}>
            Registro guardado ({evidences.length})
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.hint}>Todavía no hay evidencias.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardText}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.meta}>
                {item.uploadedByName} ·{" "}
                {new Date(item.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.link}>
                URL almacenada en la base de datos
              </Text>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <AppButton title="Volver a tareas" onPress={onBack} color="secondary" />
      </View>
      <Modal visible={cameraVisible} animationType="slide">
        <SafeAreaView style={styles.cameraScreen}>
          <CameraView ref={camera} style={styles.camera} facing="back" />
          <View style={styles.cameraActions}>
            <AppButton title="Tomar foto" onPress={takePhoto} />
            <AppButton
              title="Cancelar"
              onPress={() => setCameraVisible(false)}
              color="secondary"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F9FC" },
  header: { padding: 20, borderBottomWidth: 1, borderColor: "#D6E0EA" },
  title: { fontSize: 26, fontWeight: "700", color: "#102A43" },
  subtitle: { marginTop: 4, color: "#0F8B8D", fontWeight: "700" },
  form: {
    padding: 14,
    gap: 9,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#D6E0EA",
  },
  label: { color: "#102A43", fontWeight: "700" },
  hint: { color: "#52667A", fontStyle: "italic" },
  preview: {
    width: "100%",
    height: 190,
    borderRadius: 8,
    backgroundColor: "#D6E0EA",
  },
  list: { padding: 14, flexGrow: 1 },
  listTitle: { fontWeight: "700", color: "#102A43", marginBottom: 10 },
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D6E0EA",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: { width: "100%", height: 180, backgroundColor: "#D6E0EA" },
  cardText: { padding: 10, gap: 4 },
  description: { fontWeight: "700", color: "#102A43" },
  meta: { color: "#52667A", fontSize: 12 },
  link: { color: "#0F8B8D", fontSize: 12 },
  footer: { padding: 14, borderTopWidth: 1, borderColor: "#D6E0EA" },
  cameraScreen: { flex: 1, backgroundColor: "#111" },
  camera: { flex: 1 },
  cameraActions: { padding: 16, gap: 10, backgroundColor: "#111" },
});
