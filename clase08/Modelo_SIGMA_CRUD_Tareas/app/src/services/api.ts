import { API_URL } from "../config/api";
export type ApiError = Error & { status?: number };
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error: ApiError = new Error(
      data?.message ?? "No se pudo completar la operación.",
    );
    error.status = response.status;
    throw error;
  }
  return data as T;
}
