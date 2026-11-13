export type Role = "SUPERVISOR" | "TECHNICIAN";
export type TaskStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "CLOSED";
export type User = { id: number; fullName: string; email: string; role: Role };
export type Task = { id: number; title: string; description: string; status: TaskStatus; created_by: number; assigned_to: number | null; creator_name: string; assigned_name: string | null; latitude: number | null; longitude: number | null; location_accuracy: number | null; location_captured_at: string | null; location_address: string | null; created_at: string; updated_at: string };
export type TaskPayload = { title: string; description: string; status?: TaskStatus; assignedTo?: number | null; latitude?: number | null; longitude?: number | null; locationAccuracy?: number | null; locationCapturedAt?: string | null; locationAddress?: string | null };
