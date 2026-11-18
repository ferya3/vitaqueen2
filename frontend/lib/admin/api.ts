"use client";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

/** Fetch wrapper for the admin BFF (/api/admin/*). Cookies are sent automatically. */
export async function adminFetch<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(`/api/admin/${path.replace(/^\//, "")}`, {
    ...rest,
    headers: { Accept: "application/json", ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    credentials: "same-origin",
    cache: "no-store",
  });

  if (res.status === 401 && typeof window !== "undefined" && !path.startsWith("auth/")) {
    // Session expired: a full navigation (not router.push) so proxy.ts re-checks the cookie.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname)}`);
    throw new ApiError(401, "Unauthenticated");
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data?.message ?? `HTTP ${res.status}`, data?.errors ?? {});
  return data as T;
}

export function errorMessage(error: unknown, fallback = "خطایی رخ داد.") {
  if (error instanceof ApiError) {
    if (error.status === 403) return "شما مجوز انجام این عملیات را ندارید.";
    const first = Object.values(error.errors)[0]?.[0];
    return first ?? error.message ?? fallback;
  }
  return fallback;
}
