import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '../components/TaskCard';
import { tasks } from '../data/tasks';

export default function TareasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas pendientes</Text>
      <Text style={styles.subtitle}>Seleccioná una orden para ver su detalle.</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F8FA' },
  title: { fontSize: 26, fontWeight: '700', color: '#102A43' },
  subtitle: { color: '#52606D', marginTop: 6, marginBottom: 16, fontSize: 16 },
  list: { gap: 12, paddingBottom: 24 },
});
