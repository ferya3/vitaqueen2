"use client";

import { ArrowUpLeft, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import type { NavItem } from "@/components/navigation/nav-items";
import { Button } from "@/components/ui/button";
import { href, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  locale: Locale;
  siteName: string;
  items: (NavItem & { label: string })[];
  labels: { menu: string; close: string; language: string; cta: string; home: string };
  phone?: string;
}

/**
 * Transparent over the hero, turns into a frosted white bar on scroll.
 * Every page starts with a dark hero/banner, so the transparent state is always legible.
 */
export function SiteHeader({ locale, siteName, items, labels, phone }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (state adjustment during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  const solid = scrolled || open;
  const tone = solid ? "dark" : "light";
  const isActive = (path: string) => pathname === href(locale, path) || pathname.startsWith(href(locale, path) + "/");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-water)]",
        solid ? "border-b border-line/70 bg-white/85 shadow-[0_8px_30px_-20px_rgb(7_59_89/0.35)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href={href(locale)} aria-label={`${siteName} — ${labels.home}`} className="shrink-0">
          <Logo name={siteName} tone={tone} />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={href(locale, item.path)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors",
                    tone === "light" ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-ink/80 hover:bg-cloud hover:text-deep-600",
                    isActive(item.path) && (tone === "light" ? "bg-white/10 text-white" : "bg-water-50 text-water-700"),
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <LocaleSwitcher locale={locale} label={labels.language} tone={tone} />
          <Button asChild size="sm" variant={tone === "light" ? "glass" : "primary"} className="hidden md:inline-flex">
            <Link href={href(locale, "/representatives")}>
              {labels.cta}
              <ArrowUpLeft className="ltr:-scale-x-100" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
            className={cn(
              "grid size-11 place-items-center rounded-full transition-colors xl:hidden",
              tone === "light" ? "text-white hover:bg-white/10" : "text-deep-600 hover:bg-deep-50",
            )}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - var(--header-h))" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto bg-white xl:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex min-h-full flex-col py-6">
              <ul className="space-y-1">
                {[{ key: "home" as const, path: "/", label: labels.home }, ...items].map((item, i) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                  >
                    <Link
                      href={href(locale, item.path)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-semibold text-deep-600 hover:bg-cloud",
                        item.path !== "/" && isActive(item.path) && "bg-water-50 text-water-700",
                      )}
                    >
                      <span>
                        {item.label}
                        {"description" in item && item.description && (
                          <span className="mt-0.5 block text-xs font-normal text-muted">{item.description}</span>
                        )}
                      </span>
                      <ArrowUpLeft className="size-4 opacity-40 ltr:-scale-x-100" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3 pt-8">
                <Button asChild size="lg" className="w-full">
                  <Link href={href(locale, "/representatives")}>{labels.cta}</Link>
                </Button>
                {phone && (
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="ltr-value block text-center text-sm text-muted">
                    {phone}
                  </a>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
