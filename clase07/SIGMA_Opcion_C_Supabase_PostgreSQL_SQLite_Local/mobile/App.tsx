import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createTask, initDatabase, listTasks, pendingCount, removeTask, Task, toggleTask } from './src/database';
import { synchronize } from './src/sync';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [online, setOnline] = useState(false);
  const [pending, setPending] = useState(0);

  const refresh = async () => { setTasks(await listTasks()); setPending(await pendingCount()); };
  useEffect(() => { initDatabase().then(refresh); return NetInfo.addEventListener(state => setOnline(Boolean(state.isConnected && state.isInternetReachable !== false))); }, []);

  const add = async () => { if (!title.trim()) return; await createTask(title.trim()); setTitle(''); await refresh(); };
  const sync = async () => { const result = await synchronize(); await refresh(); Alert.alert('Supabase', result.message); };

  return <SafeAreaProvider><SafeAreaView style={styles.screen}><StatusBar style="light" />
    <View style={styles.header}><Text style={styles.title}>SIGMA · Opción C</Text><Text style={styles.subtitle}>Supabase PostgreSQL + SQLite local</Text><Text style={styles.status}>{online ? '● Online' : '● Offline'} · {pending} operación(es) en cola</Text><Pressable style={styles.sync} onPress={sync}><Text style={styles.syncText}>Sincronizar con Supabase</Text></Pressable></View>
    <View style={styles.form}><TextInput value={title} onChangeText={setTitle} placeholder="Nueva tarea de mantenimiento" style={styles.input} /><Pressable style={styles.add} onPress={add}><Text style={styles.white}>Agregar</Text></Pressable></View>
    <FlatList contentContainerStyle={styles.list} data={tasks} keyExtractor={item => item.id} ListEmptyComponent={<Text style={styles.empty}>No hay tareas. Creá una incluso sin conexión.</Text>} renderItem={({ item }) => <View style={styles.card}><Pressable onPress={async () => { await toggleTask(item); await refresh(); }}><Text style={item.status === 'FINALIZADA' ? styles.done : styles.task}>{item.status === 'FINALIZADA' ? '✓ ' : '○ '}{item.title}</Text></Pressable><View style={styles.right}><Text style={item.syncStatus === 'SINCRONIZADA' ? styles.ok : styles.wait}>{item.syncStatus}</Text><Pressable onPress={async () => { await removeTask(item); await refresh(); }}><Text style={styles.delete}>Eliminar</Text></Pressable></View></View>} />
  </SafeAreaView></SafeAreaProvider>;
}

const styles = StyleSheet.create({ screen:{flex:1,backgroundColor:'#f5f7fb'},header:{backgroundColor:'#183b5b',padding:20},title:{color:'white',fontSize:23,fontWeight:'700'},subtitle:{color:'#d8e8f5',marginTop:4},status:{color:'#ffd166',marginTop:8,fontWeight:'700'},sync:{marginTop:12,alignSelf:'flex-start',padding:9,backgroundColor:'white',borderRadius:7},syncText:{color:'#183b5b',fontWeight:'700'},form:{padding:14,flexDirection:'row',gap:8},input:{backgroundColor:'white',borderWidth:1,borderColor:'#cbd5e1',borderRadius:7,padding:10,flex:1},add:{backgroundColor:'#2e75b6',borderRadius:7,justifyContent:'center',paddingHorizontal:12},white:{color:'white',fontWeight:'700'},list:{padding:14,gap:8},card:{backgroundColor:'white',padding:14,borderRadius:9,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},task:{fontWeight:'700',fontSize:16},done:{color:'#64748b',textDecorationLine:'line-through',fontSize:16},right:{alignItems:'flex-end',gap:5},ok:{color:'#2e7d32',fontSize:11,fontWeight:'700'},wait:{color:'#c55a11',fontSize:11,fontWeight:'700'},delete:{color:'#c00000',fontSize:12},empty:{padding:25,textAlign:'center',color:'#64748b'} });
