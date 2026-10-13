export type TaskStatus = 'PENDIENTE' | 'FINALIZADA';
export type SyncStatus = 'PENDIENTE' | 'SINCRONIZADA';

export interface Task {
  id: string;
  title: string;
  createdAt: string;
  status: TaskStatus;
  syncStatus: SyncStatus;
}
