export const locales = ["fa", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export const localeMeta: Record<Locale, { label: string; short: string; dir: "rtl" | "ltr"; ogLocale: string; intl: string }> = {
  fa: { label: "فارسی", short: "FA", dir: "rtl", ogLocale: "fa_IR", intl: "fa-IR" },
  en: { label: "English", short: "EN", dir: "ltr", ogLocale: "en_US", intl: "en-US" },
  ar: { label: "العربية", short: "AR", dir: "rtl", ogLocale: "ar_AR", intl: "ar" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return localeMeta[locale].dir;
}

/** Build a locale-prefixed path: href("fa", "/products") -> "/fa/products" */
export function href(locale: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
