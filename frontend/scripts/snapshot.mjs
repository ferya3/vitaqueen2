#!/usr/bin/env node
/**
 * Snapshot the public API into data/snapshot/<locale>.json.
 *
 * The snapshot lets `next build` succeed (and the site keep rendering) when the
 * Laravel API is temporarily unreachable. Re-run after seeding real content:
 *
 *   API_INTERNAL_URL=http://localhost:8000/api/v1 npm run snapshot
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const API = (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, "");
const locales = ["fa", "en", "ar"];
const outDir = path.join(process.cwd(), "data", "snapshot");

async function get(p, locale) {
  const res = await fetch(`${API}${p}${p.includes("?") ? "&" : "?"}locale=${locale}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${p}`);
  return res.json();
}

await mkdir(outDir, { recursive: true });

for (const locale of locales) {
  const [home, settings, categories, products, articles, certificates, lines, steps, sitemap] = await Promise.all([
    get("/home", locale),
    get("/settings", locale),
    get("/categories", locale),
    get("/products", locale),
    get("/articles?page=1&per_page=9", locale),
    get("/certificates", locale),
    get("/production-lines", locale),
    get("/production-steps", locale),
    get("/sitemap", locale),
  ]);

  const productDetails = {};
  for (const { slug } of sitemap.data.products) productDetails[slug] = await get(`/products/${encodeURIComponent(slug)}`, locale);

  const articleDetails = {};
  for (const { slug } of sitemap.data.articles) articleDetails[slug] = await get(`/articles/${encodeURIComponent(slug)}`, locale);

  const pages = {};
  for (const slug of ["about", "export", "privacy"]) {
    try {
      pages[slug] = (await get(`/pages/${slug}`, locale)).data;
    } catch {
      /* optional page */
    }
  }

  const snapshot = {
    generated_at: new Date().toISOString(),
    home: home.data,
    settings: settings.data,
    categories: categories.data,
    products: products.data,
    productDetails,
    articles,
    articleDetails,
    certificates: certificates.data,
    productionLines: lines.data,
    productionSteps: steps.data,
    pages,
    sitemap: sitemap.data,
  };

  await writeFile(path.join(outDir, `${locale}.json`), JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`✓ ${locale}: ${products.data.length} products, ${articles.data.length} articles`);
}
