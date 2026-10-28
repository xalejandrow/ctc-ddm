import { API_URL } from '../config/api';

type ApiError = Error & { status?: number };

export async function apiFetch<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    const error: ApiError = new Error(data.message ?? 'Ocurrió un error al comunicarse con la API.');
    error.status = response.status;
    throw error;
  }
  return data as T;
}
