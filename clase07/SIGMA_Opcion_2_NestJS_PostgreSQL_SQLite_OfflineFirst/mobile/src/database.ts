import * as SQLite from "expo-sqlite";
export type Task = {
  id: string;
  title: string;
  status: "PENDIENTE" | "FINALIZADA";
  syncStatus: "PENDIENTE" | "SINCRONIZADA" | "ERROR";
};
export type Queue = {
  id: number;
  type: "CREATE" | "UPDATE" | "DELETE";
  task: Task;
};
let dbPromise: Promise<SQLite.SQLiteDatabase> | undefined;
const db = () => (dbPromise ??= SQLite.openDatabaseAsync("sigma.db"));
export async function init() {
  const d = await db();
  await d.execAsync(
    `PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL,title TEXT NOT NULL,status TEXT NOT NULL,sync_status TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sync_queue (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT NOT NULL,payload TEXT NOT NULL);`,
  );
}
export async function listTasks() {
  return (await (
    await db()
  ).getAllAsync<any>(
    "SELECT id,title,status,sync_status as syncStatus FROM tasks ORDER BY rowid DESC",
  )) as Task[];
}
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export async function createTask(title: string) {
  const d = await db();
  const task: Task = {
    id: uid(),
    title,
    status: "PENDIENTE",
    syncStatus: "PENDIENTE",
  };
  await d.withTransactionAsync(async () => {
    await d.runAsync(
      "INSERT INTO tasks VALUES (?,?,?,?)",
      task.id,
      task.title,
      task.status,
      task.syncStatus,
    );
    await d.runAsync(
      "INSERT INTO sync_queue(type,payload) VALUES (?,?)",
      "CREATE",
      JSON.stringify(task),
    );
  });
}
export async function toggleTask(task: Task) {
  const d = await db();
  const next: Task = {
    ...task,
    status: task.status === "PENDIENTE" ? "FINALIZADA" : "PENDIENTE",
    syncStatus: "PENDIENTE",
  };
  await d.withTransactionAsync(async () => {
    await d.runAsync(
      "UPDATE tasks SET status=?,sync_status=? WHERE id=?",
      next.status,
      next.syncStatus,
      next.id,
    );
    await d.runAsync(
      "INSERT INTO sync_queue(type,payload) VALUES (?,?)",
      "UPDATE",
      JSON.stringify(next),
    );
  });
}
export async function pending() {
  return (
    await (
      await db()
    ).getAllAsync<any>("SELECT id,type,payload FROM sync_queue ORDER BY id")
  ).map((x) => ({ ...x, task: JSON.parse(x.payload) })) as Queue[];
}
export async function acknowledge(id: number, task: Task) {
  const d = await db();
  await d.withTransactionAsync(async () => {
    await d.runAsync("DELETE FROM sync_queue WHERE id=?", id);
    await d.runAsync(
      "UPDATE tasks SET sync_status='SINCRONIZADA' WHERE id=?",
      task.id,
    );
  });
}
export async function markError(task: Task) {
  await (
    await db()
  ).runAsync("UPDATE tasks SET sync_status='ERROR' WHERE id=?", task.id);
}
