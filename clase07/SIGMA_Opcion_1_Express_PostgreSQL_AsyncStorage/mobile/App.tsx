import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from './src/config';
import debugAsyncStorage from './src/debugger';

type Task = {
  id: string;
  title: string;
  status: 'PENDIENTE' | 'FINALIZADA';
  syncStatus: 'PENDIENTE' | 'SINCRONIZADA' | 'ERROR';
};

type Operation = {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  task: Task;
};

const TASKS = '@sigma/tasks';
const QUEUE = '@sigma/queue';
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const read = async <T,>(key: string, fallback: T): Promise<T> => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

const save = (key: string, value: unknown) =>
  AsyncStorage.setItem(key, JSON.stringify(value));

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(false);

  const refresh = async () => {
    setTasks(await read<Task[]>(TASKS, []));
    setPending((await read<Operation[]>(QUEUE, [])).length);
  };

  useEffect(() => {
    refresh();
    debugAsyncStorage();
    return NetInfo.addEventListener((state) => {
      setOnline(
        Boolean(state.isConnected && state.isInternetReachable !== false),
      );
    });
  }, []);

  const enqueue = async (operation: Operation) => {
    const queue = await read<Operation[]>(QUEUE, []);
    const related = queue.filter((item) => item.task.id === operation.task.id);
    const others = queue.filter((item) => item.task.id !== operation.task.id);

    if (
      operation.type === 'UPDATE' &&
      related.some((item) => item.type === 'CREATE')
    ) {
      return save(QUEUE, [
        ...others,
        {
          ...related.find((item) => item.type === 'CREATE')!,
          task: operation.task,
        },
      ]);
    }

    if (
      operation.type === 'DELETE' &&
      related.some((item) => item.type === 'CREATE')
    ) {
      return save(QUEUE, others);
    }

    await save(QUEUE, [
      ...others,
      ...related.filter((item) => item.type !== 'UPDATE'),
      operation,
    ]);
  };

  const add = async () => {
    if (!text.trim()) return;

    const task: Task = {
      id: uid(),
      title: text.trim(),
      status: 'PENDIENTE',
      syncStatus: 'PENDIENTE',
    };

    await save(TASKS, [task, ...(await read<Task[]>(TASKS, []))]);
    await enqueue({ id: uid(), type: 'CREATE', task });
    setText('');
    refresh();
  };

  const toggle = async (task: Task) => {
    const changed: Task = {
      ...task,
      status: task.status === 'PENDIENTE' ? 'FINALIZADA' : 'PENDIENTE',
      syncStatus: 'PENDIENTE',
    };

    await save(
      TASKS,
      (await read<Task[]>(TASKS, [])).map((item) =>
        item.id === task.id ? changed : item,
      ),
    );
    await enqueue({ id: uid(), type: 'UPDATE', task: changed });
    refresh();
  };

  const sync = async () => {
    const state = await NetInfo.fetch();

    console.info('NetInfo.fetch()', state);
    debugAsyncStorage();
    
    if (!state.isConnected) {
      return Alert.alert('Sin conexión', 'La cola se mantiene guardada.');
    }

    let queue = await read<Operation[]>(QUEUE, []);

    console.log('sync() queue', queue);
    console.log('${API_URL}', `${API_URL}`);
    
    for (const operation of queue) {
      try {
        if (operation.type === 'CREATE') {
          await axios.post(`${API_URL}/tasks`, operation.task);
        }
        if (operation.type === 'UPDATE') {
          await axios.patch(
            `${API_URL}/tasks/${operation.task.id}`,
            operation.task,
          );
        }
        if (operation.type === 'DELETE') {
          await axios.delete(`${API_URL}/tasks/${operation.task.id}`);
        }

        queue = queue.filter((item) => item.id !== operation.id);
        await save(QUEUE, queue);

        if (operation.type !== 'DELETE') {
          await save(
            TASKS,
            (await read<Task[]>(TASKS, [])).map((item) =>
              item.id === operation.task.id
                ? { ...item, syncStatus: 'SINCRONIZADA' }
                : item,
            ),
          );
        }
      } catch {
        await save(
          TASKS,
          (await read<Task[]>(TASKS, [])).map((item) =>
            item.id === operation.task.id
              ? { ...item, syncStatus: 'ERROR' }
              : item,
          ),
        );
        break;
      }
    }

    refresh();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.screen}>
        <StatusBar style="light" />
        <View style={s.header}>
          <Text style={s.title}>SIGMA · Opción 1</Text>
          <Text style={s.sub}>
            {online ? '● Online' : '● Offline'} · {pending} operación(es) en
            cola
          </Text>
          <Pressable style={s.sync} onPress={sync}>
            <Text style={s.syncText}>Sincronizar con API</Text>
          </Pressable>
        </View>
        <View style={s.form}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Nueva tarea de mantenimiento"
            style={s.input}
          />
          <Pressable style={s.add} onPress={add}>
            <Text style={s.white}>Agregar</Text>
          </Pressable>
        </View>
        <FlatList
          contentContainerStyle={s.list}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => toggle(item)} style={s.card}>
              <Text style={item.status === 'FINALIZADA' ? s.done : s.task}>
                {item.status === 'FINALIZADA' ? '✓ ' : '○ '}
                {item.title}
              </Text>
              <Text style={item.syncStatus === 'SINCRONIZADA' ? s.ok : s.wait}>
                {item.syncStatus}
              </Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { backgroundColor: '#183b5b', padding: 20 },
  title: { color: 'white', fontSize: 23, fontWeight: '700' },
  sub: { color: '#d8e8f5', marginTop: 5 },
  sync: {
    marginTop: 12,
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  syncText: { color: '#183b5b', fontWeight: '700' },
  form: { padding: 14, flexDirection: 'row', gap: 8 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    padding: 10,
    flex: 1,
  },
  add: {
    backgroundColor: '#2e75b6',
    borderRadius: 7,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  white: { color: 'white', fontWeight: '700' },
  list: { padding: 14, gap: 8 },
  card: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  task: { fontWeight: '700' },
  done: { color: '#64748b', textDecorationLine: 'line-through' },
  ok: { color: '#2e7d32', fontSize: 11, fontWeight: '700' },
  wait: { color: '#c55a11', fontSize: 11, fontWeight: '700' },
});
