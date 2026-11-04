import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../config/api';
import { AppButton } from '../components/AppButton';
import { TaskCard } from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { Task, TaskPayload, Technician } from '../types';
import { EvidenceScreen } from './EvidenceScreen';
import { TaskFormScreen } from './TaskFormScreen';

async function readResponse(response: Response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) { const error = new Error(data?.message ?? 'No se pudo completar la operación.') as Error & { status?: number }; error.status = response.status; throw error; }
  return data;
}

export function TasksScreen() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [editing, setEditing] = useState<Task | null | undefined>(undefined);
  const [evidenceTask, setEvidenceTask] = useState<Task | null>(null);
  const load = useCallback(async () => {
    try {
      const tasksResponse = await fetch(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(await readResponse(tasksResponse));
      if (user?.role === 'SUPERVISOR') { const techniciansResponse = await fetch(`${API_URL}/users/technicians`, { headers: { Authorization: `Bearer ${token}` } }); setTechnicians(await readResponse(techniciansResponse)); }
    } catch (error) { if ((error as Error & { status?: number }).status === 401) { await logout(); return; } Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido'); }
  }, [token, user?.role, logout]);
  useEffect(() => { load(); }, [load]);
  async function save(payload: TaskPayload) { const path = editing === null ? '/tasks' : `/tasks/${editing?.id}`; const response = await fetch(`${API_URL}${path}`, { method: editing === null ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }); await readResponse(response); setEditing(undefined); await load(); }
  async function claim(id: number) { try { await readResponse(await fetch(`${API_URL}/tasks/${id}/claim`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })); await load(); } catch (error) { Alert.alert('No se puede tomar', error instanceof Error ? error.message : 'Error'); } }
  async function release(id: number) { try { await readResponse(await fetch(`${API_URL}/tasks/${id}/release`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })); await load(); } catch (error) { Alert.alert('No se puede liberar', error instanceof Error ? error.message : 'Error'); } }
  function remove(id: number) { Alert.alert('Eliminar tarea', 'Esta acción no se puede deshacer.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', style: 'destructive', onPress: async () => { try { await readResponse(await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })); await load(); } catch (error) { Alert.alert('Error', error instanceof Error ? error.message : 'Error'); } } }]); }
  if (!user || !token) return null;
  if (evidenceTask) return <EvidenceScreen task={evidenceTask} token={token} onBack={() => setEvidenceTask(null)} />;
  if (editing !== undefined) return <TaskFormScreen task={editing} user={user} technicians={technicians} onSave={save} onCancel={() => setEditing(undefined)} />;
  return <SafeAreaView style={styles.container} edges={['top']}><View style={styles.header}><Text style={styles.title}>Tareas SIGMA</Text><Text style={styles.role}>{user.name} · {user.role}</Text></View><FlatList data={tasks} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list} renderItem={({ item }) => <TaskCard task={item} user={user} onEdit={() => setEditing(item)} onEvidence={() => setEvidenceTask(item)} onClaim={() => claim(item.id)} onRelease={() => release(item.id)} onDelete={() => remove(item.id)} />} ListEmptyComponent={<Text style={styles.empty}>No hay tareas disponibles.</Text>} /><View style={styles.footer}>{user.role === 'SUPERVISOR' && <AppButton title="Crear tarea" onPress={() => setEditing(null)} />}{user.role === 'TECNICO' && <Text style={styles.help}>Tomá una tarea abierta para poder registrar sus evidencias.</Text>}<AppButton title="Actualizar listado" onPress={load} color="secondary" /><AppButton title="Cerrar sesión" onPress={logout} color="danger" /></View></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F6F9FC' }, header: { padding: 20, borderBottomWidth: 1, borderColor: '#D6E0EA' }, title: { fontSize: 26, fontWeight: '700', color: '#102A43' }, role: { marginTop: 4, color: '#0F8B8D', fontWeight: '700' }, list: { padding: 14, flexGrow: 1 }, footer: { padding: 14, borderTopWidth: 1, borderColor: '#D6E0EA', gap: 9 }, help: { color: '#52667A', lineHeight: 18 }, empty: { textAlign: 'center', marginTop: 30, color: '#52667A' } });
