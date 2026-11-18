import { notFound } from "next/navigation";
import { BrandSection } from "@/components/home/brand-section";
import { LocationSection } from "@/components/home/location-section";
import { NewsSection } from "@/components/home/news-section";
import { PartnershipCta } from "@/components/home/partnership-cta";
import { ProductsSection } from "@/components/home/products-section";
import { QualitySection } from "@/components/home/quality-section";
import { Hero } from "@/components/hero/hero";
import { ProductionStory } from "@/components/production/production-story";
import { SectionHeading } from "@/components/ui/section-heading";
import { getHome } from "@/lib/api/public";
import { dirOf, isLocale, localeMeta } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, home] = await Promise.all([getDictionary(locale), getHome(locale)]);
  const heroProduct = home.products.find((p) => p.volume_ml === 500) ?? home.products[0];

  return (
    <>
      <Hero locale={locale} dict={dict} settings={home.settings} product={heroProduct} />
      <BrandSection locale={locale} dict={dict} stats={home.settings.stats ?? []} />
      <ProductsSection locale={locale} dict={dict} products={home.products} />
      {home.production_steps.length > 0 && (
        <ProductionStory
          steps={home.production_steps}
          dir={dirOf(locale)}
          stepLabel={dict.production.step}
          intl={localeMeta[locale].intl}
          header={<SectionHeading eyebrow={dict.production.eyebrow} title={dict.production.title} text={dict.production.text} tone="dark" />}
        />
      )}
      <QualitySection locale={locale} dict={dict} certificates={home.certificates} />
      <PartnershipCta locale={locale} dict={dict} />
      <NewsSection locale={locale} dict={dict} articles={home.articles} />
      <LocationSection locale={locale} dict={dict} settings={home.settings} />
    </>
  );
}
