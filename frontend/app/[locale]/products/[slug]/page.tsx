import { ArrowUpLeft, Beaker, Box, CalendarClock, Droplet, FileText, Layers, Package } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/animations/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { BottleShowcase } from "@/components/products/bottle-showcase";
import { ProductCard } from "@/components/products/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProduct, getSitemapData } from "@/lib/api/public";
import { href, locales } from "@/lib/i18n/config";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { formatNumber, formatVolume, stripHtml, truncate } from "@/lib/utils";

// Detail pages may block on the first visit of a slug added after the build
// (new CMS content renders fully, then is cached). Unknown slugs render the
// not-found UI with <meta name="robots" content="noindex"> (streamed responses
// start with HTTP 200 under Cache Components — see docs/architecture/frontend.md).
export const instant = false;

export async function generateStaticParams() {
  const { products } = await getSitemapData();
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { locale, settings } = await loadPageContext(params);
  const { slug } = await params;
  const res = await getProduct(locale, slug);
  if (!res) return {};
  const p = res.data;
  return buildMetadata({
    locale,
    settings,
    path: `/products/${p.slug}`,
    title: p.meta_title || p.name,
    description: p.meta_description || p.short_description || truncate(stripHtml(p.description)),
    image: p.image?.url,
  });
}

export default async function ProductPage({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, dict, settings } = await loadPageContext(params);
  const { slug } = await params;
  const res = await getProduct(locale, slug);
  if (!res) notFound();
  const { data: product, related } = res;
  const t = dict.products;

  const quick = [
    { icon: Droplet, label: t.volume, value: formatVolume(product.volume_ml, locale) },
    { icon: Layers, label: t.material, value: product.bottle_material },
    product.units_per_pack && { icon: Package, label: t.packaging, value: `${formatNumber(product.units_per_pack, locale)} ${t.perPack}` },
    product.packs_per_pallet && { icon: Box, label: "", value: `${formatNumber(product.packs_per_pallet, locale)} ${t.packsPerPallet}` },
    product.shelf_life_months && { icon: CalendarClock, label: t.shelfLife, value: `${formatNumber(product.shelf_life_months, locale)} ${t.months}` },
  ].filter(Boolean) as { icon: typeof Droplet; label: string; value: string }[];

  const hasAnalysis = product.ph !== null || product.tds !== null || product.mineral_composition.length > 0;

  return (
    <>
      <JsonLd data={productJsonLd(product, settings, locale)} />
      <PageHero
        locale={locale}
        title={product.name}
        text={product.short_description}
        eyebrow={product.category?.name}
        crumbs={[
          { name: dict.common.breadcrumbHome, path: "/" },
          { name: dict.nav.products, path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
        className="pb-28 md:pb-40"
      />

      <section className="container-x relative z-10 -mt-24 md:-mt-32">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div
              className="relative h-[440px] overflow-hidden rounded-[2rem] border border-line bg-white shadow-lift md:h-[560px]"
              style={{ background: `radial-gradient(60% 50% at 50% 65%, ${(product.accent_color ?? "#13A8CE") + "33"} 0%, transparent 70%), #fff` }}
            >
              {product.images && product.images.length > 0 ? (
                <Image src={product.images[0].url} alt={product.images[0].alt ?? product.name} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain p-8" />
              ) : (
                <BottleShowcase volume={product.volume_ml} accent={product.accent_color} brand={settings.site.name} label={product.name} interactive hint={t.rotateHint} className="size-full" />
              )}
              <Badge variant="deep" className="absolute start-5 top-5 text-sm">
                {formatVolume(product.volume_ml, locale)}
              </Badge>
            </div>
            {product.images && product.images.length > 1 && (
              <ul className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img) => (
                  <li key={img.id} className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">
                    <Image src={img.url} alt={img.alt ?? product.name} fill sizes="120px" className="object-contain p-2" />
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <div className="space-y-6 pt-4 lg:col-span-7 lg:pt-36">
            <Reveal>
              <ul className="grid gap-3 sm:grid-cols-2">
                {quick.map(({ icon: Icon, label, value }) => (
                  <li key={value} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-water-50 text-water-600">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      {label && <span className="block text-xs text-muted">{label}</span>}
                      <span className="font-semibold text-deep-600">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {product.description && (
              <Reveal>
                <div className="prose-content" dangerouslySetInnerHTML={{ __html: product.description }} />
              </Reveal>
            )}

            <Reveal className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={href(locale, "/representatives#apply")}>
                  {t.becomeAgent}
                  <ArrowUpLeft className="ltr:-scale-x-100" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={href(locale, "/representatives#wholesale")}>{t.orderWholesale}</Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          {product.specs.length > 0 && (
            <Reveal className="rounded-[var(--radius-card)] border border-line p-7">
              <h2 className="flex items-center gap-2 text-xl">
                <FileText className="size-5 text-water-600" />
                {t.specs}
              </h2>
              <dl className="mt-5 divide-y divide-line">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 py-3.5 text-sm">
                    <dt className="text-muted">{spec.label}</dt>
                    <dd className="font-semibold text-deep-600">{spec.value}</dd>
                  </div>
                ))}
                {product.sku && (
                  <div className="flex justify-between gap-4 py-3.5 text-sm">
                    <dt className="text-muted">{t.sku}</dt>
                    <dd className="ltr-value font-semibold text-deep-600">{product.sku}</dd>
                  </div>
                )}
              </dl>
            </Reveal>
          )}

          <Reveal delay={0.1} className="rounded-[var(--radius-card)] bg-deep-600 p-7 text-white">
            <h2 className="flex items-center gap-2 text-xl text-white">
              <Beaker className="size-5 text-ice" />
              {t.analysis}
            </h2>
            {hasAnalysis ? (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {product.ph !== null && (
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/60">pH</p>
                      <p className="mt-1 text-2xl font-bold">{formatNumber(product.ph, locale, { maximumFractionDigits: 2 })}</p>
                    </div>
                  )}
                  {product.tds !== null && (
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/60">TDS (mg/L)</p>
                      <p className="mt-1 text-2xl font-bold">{formatNumber(product.tds, locale)}</p>
                    </div>
                  )}
                </div>
                {product.mineral_composition.length > 0 && (
                  <>
                    <h3 className="mt-6 text-sm font-semibold text-ice">{t.minerals}</h3>
                    <ul className="mt-3 space-y-2.5">
                      {product.mineral_composition.map((m) => {
                        const max = Math.max(...product.mineral_composition.map((x) => x.value), 1);
                        return (
                          <li key={m.key} className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/75">{t.mineralNames[m.key] ?? m.key}</span>
                              <span className="font-semibold">
                                {formatNumber(m.value, locale, { maximumFractionDigits: 2 })} <span className="text-xs text-white/50">{m.unit}</span>
                              </span>
                            </div>
                            <div className="mt-1.5 h-1.5 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-gradient-to-l from-ice to-water-500" style={{ width: `${(m.value / max) * 100}%` }} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-white/20 p-5 text-sm leading-7 text-white/70">{t.analysisPending}</p>
            )}
            <Button asChild variant="glass" size="sm" className="mt-6">
              <Link href={href(locale, "/quality")}>{t.seeQuality}</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y bg-cloud">
          <div className="container-x">
            <h2 className="text-2xl md:text-3xl">{t.related}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
