import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from './types';

const TASKS_KEY = '@sigma/tareas';

export async function loadTasks(): Promise<Task[]> {
  try {
    const value = await AsyncStorage.getItem(TASKS_KEY);
    return value ? (JSON.parse(value) as Task[]) : [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
