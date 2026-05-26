import { env } from "./env";
import { getToken } from "./authToken";

export type ApiError = {
  error: { code: string; message: string; details?: unknown };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${env.API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (json as ApiError | null)?.error?.message ?? "Request failed";
    throw new Error(err);
  }
  return (json as any).data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};

