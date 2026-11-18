"use client";

import { AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, className, actions }: { title?: string; children: React.ReactNode; className?: string; actions?: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white p-5 md:p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h2 className="text-base">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("grid place-items-center py-16", className)}>
      <Loader2 className="size-6 animate-spin text-water-500" />
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="py-16 text-center text-sm text-muted">{text}</p>;
}

export function Pagination({ page, lastPage, onChange }: { page: number; lastPage: number; onChange: (p: number) => void }) {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-5">
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="قبلی">
        <ChevronRight />
      </Button>
      <span className="text-sm text-muted">
        صفحه {page.toLocaleString("fa-IR")} از {lastPage.toLocaleString("fa-IR")}
      </span>
      <Button variant="outline" size="icon" disabled={page >= lastPage} onClick={() => onChange(page + 1)} aria-label="بعدی">
        <ChevronLeft />
      </Button>
    </div>
  );
}

export function ConfirmButton({
  children,
  title,
  description,
  confirmLabel = "حذف",
  onConfirm,
  className,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={className}>
          {children}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-deep-900/50 backdrop-blur-sm" />
        <Dialog.Content dir="rtl" className="fixed start-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lift rtl:translate-x-1/2">
          <div className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-danger/10 text-danger">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <Dialog.Title className="text-lg font-bold text-deep-600">{title}</Dialog.Title>
              {description && <Dialog.Description className="mt-1 text-sm text-muted">{description}</Dialog.Description>}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" size="sm">
                انصراف
              </Button>
            </Dialog.Close>
            <Button
              variant="danger"
              size="sm"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await onConfirm();
                  setOpen(false);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy && <Loader2 className="animate-spin" />}
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function faDate(iso: unknown, withTime = false) {
  if (typeof iso !== "string" || !iso) return "—";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(new Date(iso));
}

export function faNumber(n: unknown) {
  return typeof n === "number" ? n.toLocaleString("fa-IR") : "—";
}
