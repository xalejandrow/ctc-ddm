import * as SQLite from 'expo-sqlite';

export type Status = 'PENDIENTE' | 'FINALIZADA';
export type SyncStatus = 'PENDIENTE' | 'SINCRONIZADA' | 'ERROR';
export type Task = { id: string; title: string; status: Status; syncStatus: SyncStatus; updatedAt: string };
export type QueueOperation = { id: string; type: 'UPSERT' | 'DELETE'; taskId: string; payload: string; createdAt: string };

const database = SQLite.openDatabaseAsync('sigma_supabase.db');
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export async function initDatabase() {
  const db = await database;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      sync_status TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      task_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export async function listTasks(): Promise<Task[]> {
  const db = await database;
  const rows = await db.getAllAsync<{ id: string; title: string; status: Status; sync_status: SyncStatus; updated_at: string }>(
    'SELECT * FROM tasks ORDER BY updated_at DESC'
  );
  return rows.map(row => ({ id: row.id, title: row.title, status: row.status, syncStatus: row.sync_status, updatedAt: row.updated_at }));
}

async function queue(type: QueueOperation['type'], taskId: string, payload: object) {
  const db = await database;
  // Una modificación posterior reemplaza el UPSERT anterior de la misma tarea.
  if (type === 'UPSERT') await db.runAsync("DELETE FROM sync_queue WHERE task_id = ? AND type = 'UPSERT'", taskId);
  if (type === 'DELETE') await db.runAsync('DELETE FROM sync_queue WHERE task_id = ?', taskId);
  await db.runAsync(
    'INSERT INTO sync_queue (id, type, task_id, payload, created_at) VALUES (?, ?, ?, ?, ?)',
    id(), type, taskId, JSON.stringify(payload), new Date().toISOString()
  );
}

export async function createTask(title: string) {
  const task: Task = { id: id(), title, status: 'PENDIENTE', syncStatus: 'PENDIENTE', updatedAt: new Date().toISOString() };
  const db = await database;
  await db.runAsync('INSERT INTO tasks (id,title,status,sync_status,updated_at) VALUES (?, ?, ?, ?, ?)', task.id, task.title, task.status, task.syncStatus, task.updatedAt);
  await queue('UPSERT', task.id, task);
}

export async function toggleTask(task: Task) {
  const changed: Task = { ...task, status: task.status === 'PENDIENTE' ? 'FINALIZADA' : 'PENDIENTE', syncStatus: 'PENDIENTE', updatedAt: new Date().toISOString() };
  const db = await database;
  await db.runAsync('UPDATE tasks SET status = ?, sync_status = ?, updated_at = ? WHERE id = ?', changed.status, changed.syncStatus, changed.updatedAt, changed.id);
  await queue('UPSERT', changed.id, changed);
}

export async function removeTask(task: Task) {
  const db = await database;
  await db.runAsync('DELETE FROM tasks WHERE id = ?', task.id);
  await queue('DELETE', task.id, { id: task.id });
}

export async function pendingCount() {
  const db = await database;
  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM sync_queue');
  return row?.count ?? 0;
}

export async function getQueue(): Promise<QueueOperation[]> {
  const db = await database;
  const rows = await db.getAllAsync<{ id: string; type: QueueOperation['type']; task_id: string; payload: string; created_at: string }>(
    'SELECT * FROM sync_queue ORDER BY created_at ASC'
  );
  return rows.map(row => ({ id: row.id, type: row.type, taskId: row.task_id, payload: row.payload, createdAt: row.created_at }));
}

export async function completeQueueItem(operation: QueueOperation) {
  const db = await database;
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', operation.id);
  if (operation.type === 'UPSERT') await db.runAsync("UPDATE tasks SET sync_status = 'SINCRONIZADA' WHERE id = ?", operation.taskId);
}

export async function markTaskError(taskId: string) {
  const db = await database;
  await db.runAsync("UPDATE tasks SET sync_status = 'ERROR' WHERE id = ?", taskId);
}

export async function replaceRemoteTasks(tasks: Array<{ id: string; title: string; status: Status; updated_at: string }>) {
  const db = await database;
  const pending = await db.getAllAsync<{ task_id: string }>('SELECT DISTINCT task_id FROM sync_queue');
  const pendingIds = new Set(pending.map(item => item.task_id));
  for (const task of tasks) {
    if (pendingIds.has(task.id)) continue;
    await db.runAsync(
      "INSERT OR REPLACE INTO tasks (id,title,status,sync_status,updated_at) VALUES (?, ?, ?, 'SINCRONIZADA', ?)",
      task.id, task.title, task.status, task.updated_at
    );
  }
}
