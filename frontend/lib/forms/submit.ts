import { latinDigits } from "@/lib/utils";

const API = (process.env.NEXT_PUBLIC_API_URL ?? "/api/v1").replace(/\/$/, "");

export type SubmitResult =
  | { ok: true; reference: string; message: string }
  | { ok: false; status: number; message?: string; errors?: Record<string, string[]> };

/** POST a public lead form to the Laravel API. */
export async function submitLead(endpoint: "representatives" | "contact", locale: string, data: Record<string, unknown>): Promise<SubmitResult> {
  const payload = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, typeof v === "string" ? latinDigits(v.trim()) : v]).filter(([, v]) => v !== "" && v !== undefined),
  );

  try {
    const res = await fetch(`${API}/${endpoint}?locale=${locale}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "Accept-Language": locale },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, reference: json?.data?.reference ?? "", message: json?.message ?? "" };
    return { ok: false, status: res.status, message: json?.message, errors: json?.errors };
  } catch {
    return { ok: false, status: 0 };
  }
}

export const phonePattern = /^\+?[0-9]{7,15}$/;
export const normalizePhone = (v: string) => latinDigits(v).replace(/[\s\-()]/g, "");
