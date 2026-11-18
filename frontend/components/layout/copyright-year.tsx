import { cacheLife } from "next/cache";

/** Current year, cached for a day so the footer stays part of the static shell. */
export async function CopyrightYear({ locale }: { locale: string }) {
  "use cache";
  cacheLife("days");
  return <>{new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : locale, { year: "numeric" }).format(new Date())}</>;
}
