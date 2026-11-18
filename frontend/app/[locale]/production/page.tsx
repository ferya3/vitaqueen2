import type { Metadata } from "next";
import { Reveal } from "@/components/animations/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { ProductionLineCard } from "@/components/production/production-line-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StepIcon } from "@/components/ui/step-icon";
import { getProductionLines, getProductionSteps } from "@/lib/api/public";
import { localeMeta } from "@/lib/i18n/config";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[locale]/production">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  return buildMetadata({ locale, settings, path: "/production", title: dict.nav.production, description: dict.production.text });
}

export default async function ProductionPage({ params }: PageProps<"/[locale]/production">) {
  const { locale, dict } = await loadPageContext(params);
  const [steps, lines] = await Promise.all([getProductionSteps(locale), getProductionLines(locale)]);
  const fmt = new Intl.NumberFormat(localeMeta[locale].intl, { minimumIntegerDigits: 2 });

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.production.eyebrow}
        title={dict.production.title}
        text={dict.production.text}
        crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: dict.nav.production, path: "/production" }]}
      />

      <section className="section-y pt-10">
        <div className="container-x">
          <ol className="relative mx-auto max-w-5xl">
            <span aria-hidden className="absolute start-7 top-0 bottom-0 w-px bg-gradient-to-b from-water-200 via-water-400 to-deep-600 md:start-1/2" />
            {steps.map((step, i) => (
              <li key={step.id} className={cn("relative grid gap-6 pb-14 md:grid-cols-2 md:gap-16", i % 2 === 1 && "md:[&>div:first-of-type]:order-2")}>
                <span className="absolute start-7 top-2 z-10 grid size-14 -translate-x-1/2 place-items-center rounded-2xl bg-deep-600 text-ice shadow-glow md:start-1/2 rtl:translate-x-1/2">
                  <StepIcon name={step.icon} className="size-6" />
                </span>
                <Reveal className={cn("ps-20 md:ps-0", i % 2 === 0 ? "md:text-end md:pe-14" : "md:ps-14")}>
                  <p className="text-5xl font-extrabold text-water-100">{fmt.format(i + 1)}</p>
                  <h2 className="mt-2 text-2xl">{step.title}</h2>
                  {step.description && <p className="mt-3 leading-8 text-muted">{step.description}</p>}
                </Reveal>
                <div className="hidden md:block" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {lines.length > 0 && (
        <section className="section-y bg-cloud">
          <div className="container-x">
            <SectionHeading title={dict.production.lines} />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {lines.map((line) => (
                <ProductionLineCard key={line.id} line={line} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
