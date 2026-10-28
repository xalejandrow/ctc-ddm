import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { TaskItem } from '../components/TaskItem';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { Task } from '../types';

export function TasksScreen() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    try { setTasks(await apiFetch<Task[]>('/tasks', {}, token)); }
    catch (error) {
      const status = (error as Error & { status?: number }).status;
      if (status === 401) { await logout(); Alert.alert('Sesión vencida', 'Vuelve a iniciar sesión.'); return; }
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido.');
    }
  }, [token, logout]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  async function assignTask() {
    try {
      await apiFetch<Task>('/tasks/2/assign', { method: 'PATCH', body: JSON.stringify({ tecnicoId: 1 }) }, token);
      Alert.alert('Correcto', 'La tarea fue asignada por el supervisor.');
      loadTasks();
    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      Alert.alert(status === 403 ? 'Acceso denegado (403)' : 'Error', error instanceof Error ? error.message : 'Error desconocido.');
    }
  }

  return <SafeAreaView style={styles.container} edges={['top']}><View style={styles.header}><Text style={styles.title}>Hola, {user?.name}</Text><Text style={styles.role}>Rol: {user?.role}</Text></View><FlatList data={tasks} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <TaskItem task={item} />} ListEmptyComponent={<Text style={styles.empty}>No hay tareas para mostrar.</Text>} contentContainerStyle={styles.list} /><View style={styles.actions}><AppButton title="Recargar tareas" onPress={loadTasks} />{user?.role === 'SUPERVISOR' && <AppButton title="Asignar tarea 2 al técnico" onPress={assignTask} />}<Text style={styles.help}>El backend siempre valida permisos. Inicia sesión con el técnico para observar una respuesta 403 si se llama este endpoint manualmente.</Text><AppButton title="Cerrar sesión" onPress={logout} variant="danger" /></View></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F6F9FC' }, header: { padding: 24, borderBottomWidth: 1, borderColor: '#D6E0EA' }, title: { fontSize: 24, fontWeight: '700', color: '#102A43' }, role: { marginTop: 4, color: '#0F8B8D', fontWeight: '700' }, list: { padding: 18, flexGrow: 1 }, actions: { padding: 18, gap: 12, borderTopWidth: 1, borderColor: '#D6E0EA' }, help: { color: '#52667A', lineHeight: 19 }, empty: { textAlign: 'center', color: '#52667A', marginTop: 24 } });
