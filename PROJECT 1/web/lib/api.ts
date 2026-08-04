import { API_BASE_URL } from "./config";

/** Error carrying the HTTP status so callers/route handlers can react (e.g. 401 -> re-login). */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.message ?? data?.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

/** Authenticated GET against the API using the caller's JWT. Server-side only. */
export async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res));
  }
  return res.json() as Promise<T>;
}

/** Unauthenticated POST (used by the login/register route handlers). */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res));
  }
  return res.json() as Promise<T>;
}
