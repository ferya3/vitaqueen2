import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { MotionProvider } from "@/components/animations/motion-provider";
import { PageTracker } from "@/components/layout/page-tracker";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { mainNav } from "@/components/navigation/nav-items";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings } from "@/lib/api/public";
import { inter, vazirmatn } from "@/lib/fonts";
import { dirOf, isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#073B59",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSettings(locale);
  return {
    ...buildMetadata({ locale, settings, path: "/" }),
    applicationName: settings.site.name,
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, settings] = await Promise.all([getDictionary(locale), getSettings(locale)]);
  const nav = mainNav(dict).map((item) => ({ ...item, label: dict.nav[item.key] }));

  return (
    <html lang={locale} dir={dirOf(locale)} className={cn(vazirmatn.variable, inter.variable)}>
      <body className={cn(locale === "en" && "font-latin")}>
        <a href="#main" className="sr-only z-[60] rounded-full bg-white px-4 py-2 text-deep-600 focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
          {dict.nav.skipToContent}
        </a>
        <MotionProvider>
          <SiteHeader
            locale={locale}
            siteName={settings.site.name}
            items={nav}
            phone={settings.contact.sales_phone}
            labels={{ menu: dict.nav.menu, close: dict.nav.close, language: dict.nav.language, cta: dict.nav.partnership, home: dict.nav.home }}
          />
          <main id="main">{children}</main>
          <SiteFooter locale={locale} dict={dict} settings={settings} items={nav} />
        </MotionProvider>
        <PageTracker />
        <JsonLd data={[organizationJsonLd(settings, locale), websiteJsonLd(settings, locale)]} />
      </body>
    </html>
  );
}
