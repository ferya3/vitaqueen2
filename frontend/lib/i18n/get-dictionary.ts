import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/fa";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  fa: () => import("./dictionaries/fa").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
  ar: () => import("./dictionaries/ar").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

export type { Dictionary };
