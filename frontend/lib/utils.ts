import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { localeMeta, type Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(localeMeta[locale].intl, options).format(value);
}

/** 500 -> "۵۰۰ میلی‌لیتر", 1500 -> "۱٫۵ لیتر" */
export function formatVolume(ml: number, locale: Locale) {
  const units = {
    fa: { ml: "میلی‌لیتر", l: "لیتر" },
    en: { ml: "ml", l: "L" },
    ar: { ml: "مل", l: "لتر" },
  }[locale];
  if (ml >= 1000) return `${formatNumber(ml / 1000, locale, { maximumFractionDigits: 1 })} ${units.l}`;
  return `${formatNumber(ml, locale)} ${units.ml}`;
}

export function formatDate(iso: string | null | undefined, locale: Locale, opts: Intl.DateTimeFormatOptions = { dateStyle: "long" }) {
  if (!iso) return "";
  try {
    const intl = locale === "fa" ? "fa-IR-u-ca-persian" : localeMeta[locale].intl;
    return new Intl.DateTimeFormat(intl, opts).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function stripHtml(html: string | null | undefined) {
  return (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, length = 160) {
  return text.length > length ? `${text.slice(0, length - 1).trimEnd()}…` : text;
}

/** Normalize Persian / Arabic-Indic digits to Latin. */
export function latinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
