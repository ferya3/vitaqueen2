import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";

// The panel is an authenticated, client-rendered app: it waits for the session
// (/auth/me) before rendering pages, so instant-navigation validation does not apply.
export const instant = false;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
