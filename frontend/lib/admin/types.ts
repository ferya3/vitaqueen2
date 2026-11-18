export type Role = "super_admin" | "content_manager" | "sales_manager" | "qc_manager";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  role_label: string;
  abilities: string[];
  is_active: boolean;
  last_login_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null };
}

export type Row = Record<string, unknown> & { id: number };

export function can(user: AdminUser | null, ability: string, write = false) {
  if (!user || !user.is_active) return false;
  if (user.abilities.includes("*") || user.abilities.includes(ability)) return true;
  return !write && user.abilities.includes(`${ability}.view`);
}
