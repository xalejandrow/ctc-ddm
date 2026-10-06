import { Task } from "../types/task";

const BASE_URL = "https://jsonplaceholder.typicode.com";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getTasks(): Promise<Task[]> {
  return request<Task[]>("/todos?_limit=12");
}

export function createTask(title: string): Promise<Task> {
  return request<Task>("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false, userId: 1 }),
  });
}

export function toggleTask(task: Task): Promise<Task> {
  return request<Task>(`/todos/${task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !task.completed }),
  });
}

export async function deleteTask(id: number): Promise<void> {
  await request<Record<string, never>>(`/todos/${id}`, { method: "DELETE" });
}
