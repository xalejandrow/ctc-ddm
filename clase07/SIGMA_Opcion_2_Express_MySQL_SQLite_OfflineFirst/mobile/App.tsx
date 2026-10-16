import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createTask, deleteTask, initializeDatabase, listVisibleTasks, toggleTask } from './src/database';
import { synchronize } from './src/sync';
import { Task } from './src/types';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [online, setOnline] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const refresh = async () => setTasks(await listVisibleTasks());

  useEffect(() => {
    initializeDatabase().then(refresh);
    return NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
  }, []);

  const add = async () => {
    if (!title.trim()) return;
    await createTask(title.trim());
    setTitle('');
    await refresh();
  };

  const sync = async () => {
    setSyncing(true);
    const result = await synchronize();
    await refresh();
    setSyncing(false);
    Alert.alert('Sincronizacion', result.message);
  };

  const remove = (task: Task) => {
    Alert.alert('Eliminar tarea', `¿Eliminar "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await deleteTask(task); await refresh(); } },
    ]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.title}>SIGMA Mantenimiento</Text>
          <Text style={styles.subtitle}>{online ? '● Online' : '● Offline'} - SQLite local + MySQL remoto</Text>
          <Pressable style={[styles.syncButton, syncing && styles.disabled]} disabled={syncing} onPress={sync}>
            <Text style={styles.syncText}>{syncing ? 'Sincronizando...' : 'Sincronizar ahora'}</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <TextInput value={title} onChangeText={setTitle} placeholder="Nueva tarea de mantenimiento" style={styles.input} onSubmitEditing={add} />
          <Pressable style={styles.addButton} onPress={add}><Text style={styles.buttonText}>Agregar</Text></Pressable>
        </View>

        <Text style={styles.help}>Tocar una tarea cambia su estado. El boton X la elimina localmente y la encola.</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay tareas activas.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable style={styles.taskArea} onPress={async () => { await toggleTask(item); await refresh(); }}>
                <Text style={item.status === 'FINALIZADA' ? styles.done : styles.task}>
                  {item.status === 'FINALIZADA' ? '✓ ' : '○ '}{item.title}
                </Text>
                <Text style={item.syncStatus === 'SINCRONIZADA' ? styles.synced : styles.pending}>{item.syncStatus}</Text>
              </Pressable>
              <Pressable accessibilityLabel="Eliminar tarea" style={styles.deleteButton} onPress={() => remove(item)}><Text style={styles.deleteText}>X</Text></Pressable>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f7fb' },
  header: { backgroundColor: '#173a5e', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#d7e7f6', marginTop: 6 },
  syncButton: { alignSelf: 'flex-start', marginTop: 14, backgroundColor: '#fff', borderRadius: 7, paddingHorizontal: 12, paddingVertical: 9 },
  syncText: { color: '#173a5e', fontWeight: '700' },
  disabled: { opacity: 0.6 },
  form: { flexDirection: 'row', gap: 8, padding: 14 },
  input: { flex: 1, backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  addButton: { justifyContent: 'center', backgroundColor: '#2563a9', borderRadius: 8, paddingHorizontal: 14 },
  buttonText: { color: '#fff', fontWeight: '700' },
  help: { color: '#52657a', fontSize: 12, paddingHorizontal: 14, paddingBottom: 4 },
  list: { gap: 9, padding: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 9, shadowColor: '#0f172a', shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  taskArea: { flex: 1, padding: 14 },
  task: { color: '#172b42', fontWeight: '700' },
  done: { color: '#64748b', fontWeight: '700', textDecorationLine: 'line-through' },
  synced: { color: '#18834b', fontSize: 11, fontWeight: '700', marginTop: 6 },
  pending: { color: '#b45309', fontSize: 11, fontWeight: '700', marginTop: 6 },
  deleteButton: { marginRight: 12, borderRadius: 18, backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 7 },
  deleteText: { color: '#b91c1c', fontWeight: '800' },
  empty: { color: '#64748b', textAlign: 'center', marginTop: 30 },
});
