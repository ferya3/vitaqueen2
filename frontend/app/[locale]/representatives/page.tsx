import { Globe2, Handshake, Store, Truck } from "lucide-react";
import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { RepresentativeForm } from "@/components/forms/representative-form";
import { PageHero } from "@/components/layout/page-hero";
import { getPage } from "@/lib/api/public";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/representatives">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  return buildMetadata({ locale, settings, path: "/representatives", title: dict.partnership.title, description: dict.partnership.text });
}

export default async function RepresentativesPage({ params }: PageProps<"/[locale]/representatives">) {
  const { locale, dict } = await loadPageContext(params);
  const exportPage = await getPage(locale, "export");
  const p = dict.partnership;
  const channels = [
    { id: "agency", icon: Handshake, ...p.channels.agency },
    { id: "distribution", icon: Truck, ...p.channels.distribution },
    { id: "export", icon: Globe2, ...p.channels.export },
    { id: "wholesale", icon: Store, ...p.channels.wholesale },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={p.eyebrow}
        title={p.title}
        text={p.text}
        crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: dict.nav.partnership, path: "/representatives" }]}
      />

      <section className="container-x pt-6 pb-16">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ id, icon: Icon, title, text }) => (
            <StaggerItem key={id}>
              <a href={id === "wholesale" || id === "export" ? `#${id}` : "#apply"} className="group block h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-2xl bg-water-50 text-water-600 transition-colors group-hover:bg-water-500 group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <h2 className="mt-5 text-lg">{title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-muted">{text}</p>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="apply" className="section-y bg-cloud">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-3xl">{p.formTitle}</h2>
            <p className="mt-4 leading-8 text-muted">{p.formText}</p>
            <ul className="mt-8 space-y-3">
              {p.benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 font-medium text-deep-600">
                  <span className="size-2 rounded-full bg-water-500" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[2rem] border border-line bg-white p-6 shadow-lift md:p-10 lg:col-span-8">
            <RepresentativeForm locale={locale} dict={dict.form} />
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <Reveal id="export" className="scroll-mt-28 rounded-[2rem] bg-deep-600 p-8 text-white md:p-10">
            <Globe2 className="size-10 text-ice" />
            <h2 className="mt-6 text-2xl text-white md:text-3xl">{exportPage?.title ?? p.channels.export.title}</h2>
            <p className="mt-4 leading-8 text-white/70">{exportPage?.excerpt ?? p.channels.export.text}</p>
          </Reveal>
          <Reveal id="wholesale" delay={0.1} className="scroll-mt-28 rounded-[2rem] border border-line p-8 md:p-10">
            <h2 className="text-2xl">{p.channels.wholesale.title}</h2>
            <p className="mt-2 text-sm text-muted">{p.channels.wholesale.text}</p>
            <ContactForm locale={locale} dict={dict.form} defaultType="wholesale" className="mt-6" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
