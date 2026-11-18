"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "fa", label: "فارسی", dir: "rtl" },
  { key: "en", label: "English", dir: "ltr" },
  { key: "ar", label: "العربية", dir: "rtl" },
] as const;

export type Translations = Partial<Record<"fa" | "en" | "ar", string | null>>;

/** Wraps any input with fa / en / ar tabs. The default locale (fa) is required. */
export function TranslatableField({
  value,
  onChange,
  render,
  errors,
}: {
  value: Translations | null | undefined;
  onChange: (v: Translations) => void;
  render: (props: { value: string; onChange: (v: string) => void; dir: "rtl" | "ltr"; lang: string }) => React.ReactNode;
  errors?: Record<string, string | undefined>;
}) {
  const [active, setActive] = useState<"fa" | "en" | "ar">("fa");
  const current = value ?? {};
  const tab = tabs.find((t) => t.key === active)!;

  return (
    <div>
      <div className="mb-2 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={cn(
              "relative rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
              active === t.key ? "bg-deep-600 text-white" : "bg-cloud text-muted hover:text-deep-600",
              errors?.[t.key] && "ring-2 ring-danger/40",
            )}
          >
            {t.label}
            {current[t.key] ? <span className="absolute -end-0.5 -top-0.5 size-2 rounded-full bg-success" /> : null}
          </button>
        ))}
      </div>
      {render({ value: current[active] ?? "", onChange: (v) => onChange({ ...current, [active]: v }), dir: tab.dir, lang: tab.key })}
      {errors?.[active] && <p className="mt-1 text-xs text-danger">{errors[active]}</p>}
    </div>
  );
}
