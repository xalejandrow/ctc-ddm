export type TaskStatus = 'PENDIENTE' | 'FINALIZADA';
export type SyncStatus = 'PENDIENTE' | 'SINCRONIZADA' | 'ERROR';
export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  updatedAt: string;
  deletedAt: string | null;
  syncStatus: SyncStatus;
};

export type QueueOperation = {
  queueId: number;
  type: OperationType;
  task: Omit<Task, 'syncStatus'>;
};
