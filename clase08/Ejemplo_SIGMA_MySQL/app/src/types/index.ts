export type User = { id: number; name: string; email: string; role: 'TECNICO' | 'SUPERVISOR' };
export type Task = { id: number; title: string; status: string; assignedTo: number | null };
