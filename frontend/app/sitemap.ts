import type { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/api/public";
import { href, locales, localeMeta } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/utils";

const staticPaths = ["/", "/about", "/products", "/production", "/quality", "/certificates", "/representatives", "/news", "/contact"];

function entry(path: string, lastModified?: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${href("fa", path)}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
    changeFrequency: "weekly",
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [localeMeta[l].intl, `${siteUrl}${href(l, path)}`])) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, articles } = await getSitemapData();
  return [
    ...staticPaths.map((p) => entry(p, undefined, p === "/" ? 1 : 0.8)),
    ...products.map((p) => entry(`/products/${p.slug}`, p.updated_at, 0.9)),
    ...articles.map((a) => entry(`/news/${a.slug}`, a.updated_at, 0.6)),
  ];
}
