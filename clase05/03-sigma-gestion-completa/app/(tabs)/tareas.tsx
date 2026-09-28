import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSigma } from '../../context/SigmaContext';

export default function TareasScreen() {
  const { tasks, equipment } = useSigma();
  return <View style={styles.container}><Text style={styles.title}>Tareas</Text><Text style={styles.subtitle}>Tocá una orden para ver y editar su información.</Text>
    <FlatList data={tasks} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => { const eq = equipment.find((e) => e.id === item.equipmentId); return <Pressable style={styles.card} onPress={() => router.push(`/tareas/${item.id}`)}><View style={styles.row}><Text style={styles.code}>{item.id.toUpperCase()}</Text><Text style={styles.priority}>{item.priority}</Text></View><Text style={styles.name}>{item.title}</Text><Text style={styles.detail}>{eq?.name ?? 'Equipo sin asignar'} · {item.status}</Text></Pressable>; }} />
  </View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 18, backgroundColor: '#F5F8FA' }, title: { fontSize: 27, fontWeight: '700', color: '#102A43' }, subtitle: { color: '#52606D', marginTop: 5, marginBottom: 14 }, list: { gap: 10, paddingBottom: 22 }, card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#D9E2EC' }, row: { flexDirection: 'row', justifyContent: 'space-between' }, code: { color: '#1877B9', fontWeight: '800', fontSize: 13 }, priority: { color: '#C63B3B', fontWeight: '700', fontSize: 13 }, name: { color: '#102A43', fontSize: 18, fontWeight: '700', marginTop: 4 }, detail: { color: '#52606D', marginTop: 5 } });
