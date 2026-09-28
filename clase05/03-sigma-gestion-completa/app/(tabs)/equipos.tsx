import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSigma } from '../../context/SigmaContext';

export default function EquiposScreen() {
  const { equipment } = useSigma();
  return <View style={styles.container}><Text style={styles.title}>Equipos</Text><Text style={styles.subtitle}>Tocá un equipo para ver y editar su información.</Text>
    <FlatList data={equipment} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <Pressable style={styles.card} onPress={() => router.push(`/equipos/${item.id}`)}><Text style={styles.code}>{item.code}</Text><Text style={styles.name}>{item.name}</Text><Text style={styles.detail}>{item.location} · {item.status}</Text></Pressable>} />
  </View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 18, backgroundColor: '#F5F8FA' }, title: { fontSize: 27, fontWeight: '700', color: '#102A43' }, subtitle: { color: '#52606D', marginTop: 5, marginBottom: 14 }, list: { gap: 10, paddingBottom: 22 }, card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#D9E2EC' }, code: { color: '#1877B9', fontWeight: '800', fontSize: 13 }, name: { color: '#102A43', fontSize: 18, fontWeight: '700', marginTop: 4 }, detail: { color: '#52606D', marginTop: 5 } });
