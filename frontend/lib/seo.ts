import type { Metadata } from "next";
import { href, locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/utils";
import type { Article, Product, SiteSettings } from "@/types/api";

interface BuildMetadataInput {
  locale: Locale;
  settings: SiteSettings;
  path: string; // locale-less path, e.g. "/products"
  title?: string | null;
  description?: string | null;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
}

/** Shared metadata: canonical, hreflang alternates, Open Graph and Twitter cards. */
export function buildMetadata({ locale, settings, path, title, description, image, type = "website", noIndex }: BuildMetadataInput): Metadata {
  const brand = settings.seo?.title_suffix || settings.site.name;
  const fullTitle = title ? `${title} | ${brand}` : `${settings.site.name} | ${settings.site.tagline}`;
  const desc = description || settings.site.description;
  const languages = Object.fromEntries(locales.map((l) => [localeMeta[l].intl, `${siteUrl}${href(l, path)}`]));
  const ogImage = image ? absolute(image) : `${siteUrl}${href(locale, "/opengraph-image")}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: fullTitle },
    description: desc,
    keywords: settings.seo?.keywords,
    alternates: {
      canonical: `${siteUrl}${href(locale, path)}`,
      languages: { ...languages, "x-default": `${siteUrl}${href("fa", path)}` },
    },
    openGraph: {
      type,
      title: fullTitle,
      description: desc,
      url: `${siteUrl}${href(locale, path)}`,
      siteName: settings.site.name,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title ?? settings.site.name }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [ogImage] },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function absolute(url: string) {
  return url.startsWith("http") ? url : `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

// ------------------------------------------------------------------ JSON-LD

export function organizationJsonLd(settings: SiteSettings, locale: Locale) {
  const sameAs = Object.values(settings.social ?? {}).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: settings.site.name,
    legalName: settings.site.legal_name,
    description: settings.site.description,
    url: `${siteUrl}${href(locale)}`,
    logo: `${siteUrl}/brand/logo.svg`,
    email: settings.contact.email,
    telephone: settings.contact.phone,
    address: { "@type": "PostalAddress", streetAddress: settings.contact.address, addressCountry: "IR" },
    contactPoint: [
      { "@type": "ContactPoint", telephone: settings.contact.phone, contactType: "customer service", availableLanguage: ["fa", "en", "ar"] },
      { "@type": "ContactPoint", telephone: settings.contact.sales_phone, contactType: "sales" },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(settings: SiteSettings, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: settings.site.name,
    url: `${siteUrl}${href(locale)}`,
    inLanguage: localeMeta[locale].intl,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function productJsonLd(product: Product, settings: SiteSettings, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? undefined,
    sku: product.sku ?? undefined,
    gtin13: product.barcode ?? undefined,
    category: product.category?.name,
    image: product.images?.map((i) => absolute(i.url)) ?? (product.image ? [absolute(product.image.url)] : [`${siteUrl}/products/bottle-${product.size_class}.svg`]),
    url: `${siteUrl}${href(locale, `/products/${product.slug}`)}`,
    brand: { "@type": "Brand", name: settings.site.name },
    manufacturer: { "@id": `${siteUrl}/#organization` },
    additionalProperty: [
      { "@type": "PropertyValue", name: "volume", value: product.volume_ml, unitCode: "MLT" },
      ...(product.ph !== null ? [{ "@type": "PropertyValue", name: "pH", value: product.ph }] : []),
      ...(product.tds !== null ? [{ "@type": "PropertyValue", name: "TDS", value: product.tds, unitText: "mg/L" }] : []),
    ],
  };
}

export function articleJsonLd(article: Article, settings: SiteSettings, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": article.type === "news" ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.cover_url ? [absolute(article.cover_url)] : undefined,
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at,
    inLanguage: localeMeta[locale].intl,
    author: { "@type": "Organization", name: settings.site.name },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}${href(locale, `/news/${article.slug}`)}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${href(locale, item.path)}`,
    })),
  };
}
