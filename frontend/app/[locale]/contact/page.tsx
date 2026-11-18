import { Navigation } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactInfoList, FactoryMap } from "@/components/home/location-section";
import { PageHero } from "@/components/layout/page-hero";
import { SocialLinks } from "@/components/layout/social-links";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  return buildMetadata({ locale, settings, path: "/contact", title: dict.nav.contact, description: dict.contact.text });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale, dict, settings } = await loadPageContext(params);
  const map = settings.contact.map;

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        text={dict.contact.text}
        crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: dict.nav.contact, path: "/contact" }]}
      />
      <section className="container-x grid gap-8 pt-6 pb-24 lg:grid-cols-12">
        <Reveal className="space-y-6 lg:col-span-6">
          <ContactInfoList dict={dict} contact={settings.contact} />
          <div className="relative h-96 overflow-hidden rounded-[var(--radius-card)] border border-line">
            <FactoryMap map={map} title={dict.contact.mapTitle} />
            {map && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${map.lat},${map.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute end-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-deep-600 shadow-lift"
              >
                <Navigation className="size-4" />
                {dict.contact.directions}
              </a>
            )}
          </div>
          <div className="rounded-2xl bg-deep-600 p-5">
            <SocialLinks social={settings.social} />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="rounded-[2rem] border border-line bg-white p-6 shadow-lift md:p-10 lg:col-span-6">
          <h2 className="text-2xl">{dict.contact.formTitle}</h2>
          <ContactForm locale={locale} dict={dict.form} className="mt-6" />
        </Reveal>
      </section>
    </>
  );
}
