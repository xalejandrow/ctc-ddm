import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { createTask as createTaskRequest, deleteTask as deleteTaskRequest, getTasks, toggleTask as toggleTaskRequest } from "../services/tasksApi";
import { Task } from "../types/task";

type TaskContextValue = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (title: string) => Promise<Task>;
  toggle: (task: Task) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setLoading(true);
      setError(null);
      setTasks(await getTasks());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible cargar las tareas");
    } finally {
      setLoading(false);
    }
  }

  async function create(title: string) {
    const created = await createTaskRequest(title);
    setTasks((current) => [created, ...current]);
    return created;
  }

  async function toggle(task: Task) {
    const updated = await toggleTaskRequest(task);
    setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
  }

  async function remove(id: number) {
    await deleteTaskRequest(id);
    setTasks((current) => current.filter((item) => item.id !== id));
  }

  useEffect(() => { void refresh(); }, []);

  return <TaskContext.Provider value={{ tasks, loading, error, refresh, create, toggle, remove }}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks debe utilizarse dentro de TaskProvider");
  return context;
}
