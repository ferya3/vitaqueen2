"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.errors?.email?.[0] ?? json?.message ?? "ورود ناموفق بود.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="bg-water-mesh grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lift md:p-10">
        <div className="flex items-center gap-3">
          <LogoMark className="size-11" />
          <div>
            <h1 className="text-xl">ورود به پنل مدیریت</h1>
            <p className="text-sm text-muted">مدیریت محتوای وب‌سایت کارخانه</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" name="email" type="email" dir="ltr" autoComplete="username" required className="text-start" />
          </div>
          <div>
            <Label htmlFor="password">رمز عبور</Label>
            <Input id="password" name="password" type="password" dir="ltr" autoComplete="current-password" required className="text-start" />
            <FieldError message={error ?? undefined} />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Lock />}
            ورود
          </Button>
        </form>
      </div>
    </main>
  );
}
