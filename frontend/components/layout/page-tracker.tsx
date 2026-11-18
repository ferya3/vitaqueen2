"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

/** Privacy-friendly page view counter (no cookies, aggregated per day on the server). */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || navigator.webdriver) return;
    const body = JSON.stringify({ path: pathname });
    const url = `${API}/track`;
    let sent = false;
    try {
      // Same-origin in production (Nginx routes /api/v1 to Laravel), so a JSON beacon is allowed.
      sent = navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" })) ?? false;
    } catch {
      sent = false;
    }
    if (!sent) {
      fetch(url, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
