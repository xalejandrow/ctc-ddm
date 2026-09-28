import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';

type Props = { task: Task };

export function TaskCard({ task }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/tareas/${task.id}`)}>
      <View style={styles.row}>
        <Text style={styles.id}>{task.id}</Text>
        <Text style={styles.priority}>{task.priority}</Text>
      </View>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.asset}>{task.asset}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#D9E2EC' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  id: { color: '#1877B9', fontWeight: '800' },
  priority: { color: '#C63B3B', fontWeight: '700', fontSize: 13 },
  title: { color: '#102A43', fontSize: 18, fontWeight: '700', marginTop: 8 },
  asset: { color: '#52606D', marginTop: 5 },
});
