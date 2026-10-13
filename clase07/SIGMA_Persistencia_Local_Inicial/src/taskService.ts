import { loadTasks, saveTasks } from './storage';
import { Task } from './types';

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function createTask(title: string): Promise<Task> {
  const task: Task = {
    id: makeId(),
    title: title.trim(),
    createdAt: new Date().toISOString(),
    status: 'PENDIENTE',
    syncStatus: 'PENDIENTE',
  };
  const tasks = await loadTasks();
  await saveTasks([task, ...tasks]);
  return task;
}

export async function toggleTask(id: string): Promise<Task[]> {
  const tasks = await loadTasks();
  const updated = tasks.map(task => task.id === id
    ? { ...task, status: task.status === 'PENDIENTE' ? 'FINALIZADA' : 'PENDIENTE', syncStatus: 'PENDIENTE' }
    : task);
  await saveTasks(updated);
  return updated;
}

export async function removeTask(id: string): Promise<Task[]> {
  const updated = (await loadTasks()).filter(task => task.id !== id);
  await saveTasks(updated);
  return updated;
}
