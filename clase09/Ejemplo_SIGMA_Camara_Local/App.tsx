import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Directory, File, Paths } from 'expo-file-system';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type EvidencePhoto = {
  name: string;
  size: number | null;
  uri: string;
};

const evidenceDirectory = new Directory(Paths.document, 'sigma-evidencias');

function formatSize(size: number | null) {
  if (!size) return 'Tamaño no disponible';
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function SigmaCameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<EvidencePhoto[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const loadSavedPhotos = useCallback(() => {
    if (!evidenceDirectory.exists) {
      evidenceDirectory.create({ idempotent: true, intermediates: true });
    }

    const savedFiles = evidenceDirectory
      .list()
      .filter((item): item is File => item instanceof File)
      .filter((file) => file.name.toLowerCase().endsWith('.jpg'));

    setPhotos(
      savedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        uri: file.uri,
      }))
    );
  }, []);

  useEffect(() => {
    loadSavedPhotos();
  }, [loadSavedPhotos]);

  const takeEvidencePhoto = async () => {
    if (!cameraRef.current || !cameraReady || isSaving) return;

    try {
      setIsSaving(true);

      // Expo Camera devuelve una foto temporal en la caché de la aplicación.
      const capturedPhoto = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      // Copiamos la foto a document/sigma-evidencias para conservarla.
      const temporaryFile = new File(capturedPhoto.uri);
      const fileName = `evidencia-${Date.now()}.jpg`;
      const savedFile = new File(evidenceDirectory, fileName);

      temporaryFile.copy(savedFile);
      loadSavedPhotos();

      Alert.alert(
        'Evidencia guardada',
        'La foto quedó almacenada localmente dentro de los documentos de SIGMA.'
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        'No se pudo guardar la foto',
        'Verificá que la cámara esté disponible e intentá nuevamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={styles.loadingText}>Consultando permiso de cámara…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permissionTitle}>Permiso de cámara necesario</Text>
        <Text style={styles.permissionText}>
          SIGMA necesita la cámara para registrar evidencia fotográfica de una tarea.
          Las fotos se guardarán primero en el almacenamiento local de la aplicación.
        </Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Permitir cámara</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Nueva evidencia fotográfica</Text>
      <Text style={styles.subtitle}>
        Tomá una foto. Por ahora quedará guardada únicamente en el dispositivo.
      </Text>

      <View style={styles.cameraFrame}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          onCameraReady={() => setCameraReady(true)}
        />
      </View>

      <Pressable
        style={[styles.captureButton, (!cameraReady || isSaving) && styles.disabledButton]}
        disabled={!cameraReady || isSaving}
        onPress={takeEvidencePhoto}
      >
        <Text style={styles.captureButtonText}>
          {isSaving ? 'Guardando evidencia…' : 'Tomar y guardar foto'}
        </Text>
      </Pressable>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Evidencias locales ({photos.length})</Text>
        <Pressable onPress={loadSavedPhotos}>
          <Text style={styles.refreshText}>Actualizar</Text>
        </Pressable>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.uri}
        contentContainerStyle={photos.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Todavía no hay fotos guardadas en la carpeta local de SIGMA.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.photoItem}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <View style={styles.photoInfo}>
              <Text numberOfLines={1} style={styles.photoName}>{item.name}</Text>
              <Text style={styles.photoMeta}>{formatSize(item.size)}</Text>
              <Text numberOfLines={1} style={styles.photoUri}>{item.uri}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <SigmaCameraScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  loadingText: { color: '#475569', fontSize: 16 },
  title: { color: '#0f172a', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#475569', fontSize: 15, lineHeight: 21, marginTop: 6, marginBottom: 16 },
  cameraFrame: { borderRadius: 18, height: 270, overflow: 'hidden', backgroundColor: '#0f172a' },
  camera: { flex: 1 },
  captureButton: { alignItems: 'center', backgroundColor: '#0f766e', borderRadius: 12, marginTop: 14, paddingVertical: 15 },
  disabledButton: { backgroundColor: '#94a3b8' },
  captureButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  listHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginBottom: 10 },
  listTitle: { color: '#0f172a', fontSize: 18, fontWeight: '800' },
  refreshText: { color: '#0f766e', fontSize: 15, fontWeight: '700' },
  emptyList: { flexGrow: 1 },
  emptyText: { color: '#64748b', fontSize: 15, lineHeight: 21, paddingTop: 16, textAlign: 'center' },
  photoItem: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: 14, borderWidth: 1, flexDirection: 'row', marginBottom: 10, padding: 9 },
  thumbnail: { backgroundColor: '#e2e8f0', borderRadius: 10, height: 72, width: 72 },
  photoInfo: { flex: 1, marginLeft: 11 },
  photoName: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  photoMeta: { color: '#475569', fontSize: 13, marginTop: 3 },
  photoUri: { color: '#64748b', fontSize: 11, marginTop: 5 },
  permissionBox: { backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 18, borderWidth: 1, margin: 16, padding: 22 },
  permissionTitle: { color: '#0f172a', fontSize: 22, fontWeight: '800' },
  permissionText: { color: '#475569', fontSize: 16, lineHeight: 23, marginTop: 10, marginBottom: 20 },
  primaryButton: { alignItems: 'center', backgroundColor: '#0f766e', borderRadius: 12, paddingVertical: 14 },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
});
