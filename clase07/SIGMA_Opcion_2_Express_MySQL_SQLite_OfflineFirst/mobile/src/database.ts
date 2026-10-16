import * as SQLite from 'expo-sqlite';
import { OperationType, QueueOperation, Task } from './types';

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;
const database = () => (databasePromise ??= SQLite.openDatabaseAsync('sigma-offline-first.db'));
const now = () => new Date().toISOString();
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
  const random = Math.floor(Math.random() * 16);
  const value = character === 'x' ? random : (random & 0x3) | 0x8;
  return value.toString(16);
});

export async function initializeDatabase() {
  const db = await database();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT,
      sync_status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      task_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

function toTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
    syncStatus: row.syncStatus,
  };
}

export async function listVisibleTasks() {
  const rows = await (await database()).getAllAsync<any>(`
    SELECT id, title, status, updated_at AS updatedAt, deleted_at AS deletedAt, sync_status AS syncStatus
    FROM tasks WHERE deleted_at IS NULL ORDER BY updated_at DESC
  `);
  return rows.map(toTask);
}

async function saveLocalChange(type: OperationType, task: Task) {
  const db = await database();
  const apiTask = { id: task.id, title: task.title, status: task.status, updatedAt: task.updatedAt, deletedAt: task.deletedAt };
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO tasks (id, title, status, updated_at, deleted_at, sync_status)
       VALUES (?, ?, ?, ?, ?, 'PENDIENTE')
       ON CONFLICT(id) DO UPDATE SET title = excluded.title, status = excluded.status,
       updated_at = excluded.updated_at, deleted_at = excluded.deleted_at, sync_status = 'PENDIENTE'`,
      task.id, task.title, task.status, task.updatedAt, task.deletedAt
    );
    await db.runAsync(
      'INSERT INTO sync_queue (type, task_id, payload, created_at) VALUES (?, ?, ?, ?)',
      type, task.id, JSON.stringify(apiTask), now()
    );
  });
}

export async function createTask(title: string) {
  const task: Task = { id: uuid(), title, status: 'PENDIENTE', updatedAt: now(), deletedAt: null, syncStatus: 'PENDIENTE' };
  await saveLocalChange('CREATE', task);
}

export async function toggleTask(task: Task) {
  await saveLocalChange('UPDATE', {
    ...task,
    status: task.status === 'PENDIENTE' ? 'FINALIZADA' : 'PENDIENTE',
    updatedAt: now(),
    deletedAt: null,
  });
}

export async function deleteTask(task: Task) {
  await saveLocalChange('DELETE', { ...task, updatedAt: now(), deletedAt: now() });
}

export async function getPendingOperations(): Promise<QueueOperation[]> {
  const rows = await (await database()).getAllAsync<any>(
    'SELECT id, type, payload FROM sync_queue ORDER BY id ASC'
  );
  return rows.map((row) => ({ queueId: row.id, type: row.type, task: JSON.parse(row.payload) }));
}

export async function acknowledgeOperations(queueIds: number[]) {
  if (queueIds.length === 0) return;
  const db = await database();
  await db.withTransactionAsync(async () => {
    for (const queueId of queueIds) await db.runAsync('DELETE FROM sync_queue WHERE id = ?', queueId);
    const taskIds = await db.getAllAsync<{ task_id: string }>('SELECT DISTINCT task_id FROM sync_queue');
    await db.runAsync("UPDATE tasks SET sync_status = 'SINCRONIZADA'");
    for (const item of taskIds) {
      await db.runAsync("UPDATE tasks SET sync_status = 'PENDIENTE' WHERE id = ?", item.task_id);
    }
  });
}

export async function markOperationsAsError(queueIds: number[]) {
  if (queueIds.length === 0) return;
  const db = await database();
  for (const queueId of queueIds) {
    const item = await db.getFirstAsync<{ task_id: string }>('SELECT task_id FROM sync_queue WHERE id = ?', queueId);
    if (item) await db.runAsync("UPDATE tasks SET sync_status = 'ERROR' WHERE id = ?", item.task_id);
  }
}

export async function applyTasksFromServer(remoteTasks: Omit<Task, 'syncStatus'>[]) {
  const db = await database();
  await db.withTransactionAsync(async () => {
    for (const task of remoteTasks) {
      const pending = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) AS count FROM sync_queue WHERE task_id = ?', task.id
      );
      if ((pending?.count ?? 0) > 0) continue;
      await db.runAsync(
        `INSERT INTO tasks (id, title, status, updated_at, deleted_at, sync_status)
         VALUES (?, ?, ?, ?, ?, 'SINCRONIZADA')
         ON CONFLICT(id) DO UPDATE SET title = excluded.title, status = excluded.status,
         updated_at = excluded.updated_at, deleted_at = excluded.deleted_at, sync_status = 'SINCRONIZADA'`,
        task.id, task.title, task.status, task.updatedAt, task.deletedAt
      );
    }
  });
}
