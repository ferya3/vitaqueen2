import { CheckCircle2, FlaskConical, Microscope, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { CertificateGroups } from "@/components/quality/certificate-groups";
import { getCertificates } from "@/lib/api/public";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/quality">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  return buildMetadata({ locale, settings, path: "/quality", title: dict.nav.quality, description: dict.quality.text });
}

export default async function QualityPage({ params }: PageProps<"/[locale]/quality">) {
  const { locale, dict } = await loadPageContext(params);
  const certificates = await getCertificates(locale);
  const icons = [FlaskConical, Microscope, ShieldCheck, CheckCircle2];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.quality.eyebrow}
        title={dict.quality.title}
        text={dict.quality.text}
        crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: dict.nav.quality, path: "/quality" }]}
      >
        <nav className="mt-8 flex flex-wrap gap-2">
          {[
            ["#certificates", dict.quality.certificates],
            ["#lab-reports", dict.quality.labReports],
            ["#standards", dict.quality.standards],
          ].map(([anchor, label]) => (
            <a key={anchor} href={anchor} className="glass rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="section-y pt-10">
        <div className="container-x">
          <Reveal>
            <h2 className="text-2xl md:text-3xl">{dict.quality.labTitle}</h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dict.quality.labPoints.map((point, i) => {
              const Icon = icons[i % icons.length];
              return (
                <StaggerItem key={point}>
                  <div className="h-full rounded-[var(--radius-card)] bg-cloud p-6">
                    <Icon className="size-8 text-water-600" />
                    <p className="mt-4 leading-7 font-medium text-deep-600">{point}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="container-x pb-24">
        <CertificateGroups certificates={certificates} locale={locale} dict={dict} />
      </section>
    </>
  );
}
