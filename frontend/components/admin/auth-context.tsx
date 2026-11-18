"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import type { AdminUser } from "@/lib/admin/types";

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true, logout: async () => {}, refresh: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await adminFetch<{ data: AdminUser }>("auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    window.location.replace("/admin/login"); // full reload drops all in-memory admin state
  }, []);

  useEffect(() => {
    let alive = true;
    adminFetch<{ data: AdminUser }>("auth/me")
      .then((res) => alive && setUser(res.data))
      .catch(() => alive && setUser(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading, logout, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
