import "server-only";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/api/public";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/** Resolve + validate the [locale] param and load the dictionary & settings. */
export async function loadPageContext(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [dict, settings] = await Promise.all([getDictionary(locale), getSettings(locale)]);
  return { locale: locale as Locale, dict, settings };
}
