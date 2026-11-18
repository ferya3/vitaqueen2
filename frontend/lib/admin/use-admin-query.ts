"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api";

/**
 * Minimal data hook for the admin panel. `loading` is true until data for the
 * *current* path has arrived; `reload()` refetches while keeping stale data visible.
 */
export function useAdminQuery<T>(path: string | null) {
  const [state, setState] = useState<{ path: string | null; data: T | null; error: unknown }>({ path: null, data: null, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!path) return;
    let alive = true;
    adminFetch<T>(path).then(
      (data) => alive && setState({ path, data, error: null }),
      (error) => alive && setState({ path, data: null, error }),
    );
    return () => {
      alive = false;
    };
  }, [path, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const current = state.path === path;

  return { data: current ? state.data : null, error: current ? state.error : null, loading: !current, reload };
}
