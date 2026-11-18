import { ArrowUpLeft, Building2, Compass, Eye, Gem, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountUp } from "@/components/animations/count-up";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { ProductionLineCard } from "@/components/production/production-line-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPage, getProductionLines } from "@/lib/api/public";
import { href, localeMeta } from "@/lib/i18n/config";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";
import type { PageSection } from "@/types/api";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  const page = await getPage(locale, "about");
  return buildMetadata({ locale, settings, path: "/about", title: page?.meta_title || page?.title || dict.nav.about, description: page?.meta_description || page?.excerpt });
}

const icons: Record<string, typeof Target> = { mission: Target, vision: Eye, values: Gem };

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale, dict, settings } = await loadPageContext(params);
  const [page, lines] = await Promise.all([getPage(locale, "about"), getProductionLines(locale)]);
  if (!page) notFound();

  const section = (type: string) => page.sections.find((s) => s.type === type);
  const cards = (["mission", "vision", "values"] as const).map((t) => section(t)).filter(Boolean) as PageSection[];
  const timeline = section("timeline");
  const infrastructure = section("infrastructure");

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.about.eyebrow}
        title={page.title}
        text={page.excerpt}
        crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: dict.nav.about, path: "/about" }]}
      />

      {page.body && (
        <section className="section-y pt-12">
          <Reveal className="container-x max-w-3xl">
            <div className="prose-content text-lg" dangerouslySetInnerHTML={{ __html: page.body }} />
          </Reveal>
        </section>
      )}

      {cards.length > 0 && (
        <section className="container-x pb-20">
          <Stagger className="grid gap-5 md:grid-cols-3">
            {cards.map((card) => {
              const Icon = icons[card.type] ?? Compass;
              return (
                <StaggerItem key={card.type}>
                  <article className="h-full rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-soft">
                    <span className="grid size-14 place-items-center rounded-2xl bg-water-50 text-water-600">
                      <Icon className="size-7" />
                    </span>
                    <h2 className="mt-6 text-2xl">{card.title}</h2>
                    {card.body && <p className="mt-3 leading-8 text-muted">{card.body}</p>}
                    {card.items && (
                      <ul className="mt-4 space-y-2">
                        {card.items.map((item) => (
                          <li key={String(item)} className="flex items-center gap-2 text-muted">
                            <span className="size-1.5 rounded-full bg-water-500" />
                            {typeof item === "string" ? item : item.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      )}

      <section className="section-y bg-cloud">
        <div className="container-x">
          <SectionHeading eyebrow={dict.about.capacity} title={dict.production.lines} />
          {settings.stats.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {settings.stats.map((stat) => (
                <div key={stat.key} className="rounded-[var(--radius-card)] bg-white p-6 shadow-soft">
                  <p className="text-3xl font-extrabold text-deep-600">
                    <CountUp value={stat.value} intl={localeMeta[locale].intl} useGrouping={stat.key !== "founded_year"} />
                    {stat.suffix && <span className="ms-2 text-base text-water-600">{stat.suffix}</span>}
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {lines.map((line) => (
              <ProductionLineCard key={line.id} line={line} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title={timeline?.title ?? dict.about.history} />
            {timeline?.items?.length ? (
              <ol className="relative mt-10 space-y-8 border-s-2 border-water-100 ps-8">
                {timeline.items.map((item, i) =>
                  typeof item === "string" ? null : (
                    <li key={i} className="relative">
                      <span className="absolute -start-[2.6rem] top-1 grid size-5 place-items-center rounded-full border-4 border-white bg-water-500" />
                      <p className="text-sm font-bold text-water-700">{item.year}</p>
                      <h3 className="mt-1 text-lg">{item.title}</h3>
                      {item.body && <p className="mt-1 text-muted">{item.body}</p>}
                    </li>
                  ),
                )}
              </ol>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-muted">{dict.about.timelinePending}</p>
            )}
          </div>
          {infrastructure && (
            <div>
              <SectionHeading title={infrastructure.title ?? dict.about.infrastructure} />
              <Stagger className="mt-10 grid gap-3">
                {infrastructure.items?.map((item) => (
                  <StaggerItem key={String(item)}>
                    <div className="flex items-center gap-4 rounded-2xl border border-line p-5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-deep-600 text-ice">
                        <Building2 className="size-5" />
                      </span>
                      <span className="font-medium text-deep-600">{typeof item === "string" ? item : item.title}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-deep-600 p-10 text-white md:flex-row md:items-center">
          <h2 className="text-2xl text-white md:text-3xl">{dict.partnership.title}</h2>
          <Button asChild size="lg">
            <Link href={href(locale, "/representatives")}>
              {dict.partnership.cta}
              <ArrowUpLeft className="ltr:-scale-x-100" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
