"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ locale, label, tone = "dark" }: { locale: Locale; label: string; tone?: "dark" | "light" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rest = pathname.replace(/^\/(fa|en|ar)(?=\/|$)/, "");

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors",
          tone === "light" ? "text-white hover:bg-white/10" : "text-deep-600 hover:bg-deep-50",
        )}
      >
        <Globe className="size-4" />
        <span className="font-latin">{localeMeta[locale].short}</span>
      </button>
      {open && (
        <div role="menu" className="absolute end-0 top-12 z-50 min-w-36 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
          {locales.map((l) => (
            <Link
              key={l}
              role="menuitem"
              href={`/${l}${rest}`}
              hrefLang={l}
              lang={l}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm text-ink hover:bg-cloud",
                l === locale && "bg-water-50 font-bold text-water-700",
              )}
            >
              {localeMeta[l].label}
              <span className="font-latin text-xs text-muted">{localeMeta[l].short}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
