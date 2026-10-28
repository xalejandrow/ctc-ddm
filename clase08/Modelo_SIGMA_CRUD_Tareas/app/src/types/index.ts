export type Role = "TECNICO" | "SUPERVISOR";
export type User = { id: number; name: string; email: string; role: Role };
export type Technician = Pick<User, "id" | "name" | "email">;
export type TaskStatus = "ABIERTA" | "EN_PROCESO" | "FINALIZADA";
export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignedTo: number | null;
  technicianName: string | null;
};
export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: number | null;
};
