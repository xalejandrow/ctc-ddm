import { API_URL } from "@/config/api";
let token = "";
export function setToken(value: string) {
  token = value;
}
export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "No fue posible completar la operación.");
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
