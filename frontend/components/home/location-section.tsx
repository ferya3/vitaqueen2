import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { SiteSettings } from "@/types/api";

export function FactoryMap({ map, title }: { map: SiteSettings["contact"]["map"]; title: string }) {
  if (!map) return null;
  const d = 0.02;
  const bbox = [map.lng - d, map.lat - d, map.lng + d, map.lat + d].join(",");
  return (
    <iframe
      title={title}
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${map.lat},${map.lng}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="size-full min-h-80 border-0 grayscale-[30%]"
    />
  );
}

export function ContactInfoList({ dict, contact }: { dict: Dictionary; contact: SiteSettings["contact"] }) {
  const items = [
    { icon: MapPin, label: dict.contact.address, value: contact.address },
    { icon: Phone, label: dict.contact.phone, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}`, ltr: true },
    { icon: Phone, label: dict.contact.salesPhone, value: contact.sales_phone, href: `tel:${contact.sales_phone.replace(/\s/g, "")}`, ltr: true },
    { icon: Mail, label: dict.contact.email, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
    { icon: Clock, label: dict.contact.hours, value: contact.working_hours },
  ].filter((i) => i.value);

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, value, href, ltr }) => (
        <li key={label} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-water-50 text-water-600">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted">{label}</p>
            {href ? (
              <a href={href} className={`mt-0.5 block truncate text-sm font-semibold text-deep-600 hover:text-water-700 ${ltr ? "ltr-value" : ""}`}>
                {value}
              </a>
            ) : (
              <p className="mt-0.5 text-sm leading-6 font-semibold text-deep-600">{value}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LocationSection({ locale, dict, settings }: { locale: Locale; dict: Dictionary; settings: SiteSettings }) {
  const map = settings.contact.map;
  return (
    <section className="section-y bg-cloud">
      <div className="container-x">
        <SectionHeading eyebrow={dict.contact.eyebrow} title={dict.contact.title} text={dict.contact.text} />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="space-y-6 lg:col-span-7">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
              <div className="h-80 md:h-96">
                <FactoryMap map={map} title={dict.contact.mapTitle} />
              </div>
              {map && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${map.lat},${map.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute end-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-deep-600 shadow-lift hover:text-water-700"
                >
                  <Navigation className="size-4" />
                  {dict.contact.directions}
                </a>
              )}
            </div>
            <ContactInfoList dict={dict} contact={settings.contact} />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-soft md:p-8">
              <h3 className="text-xl">{dict.contact.formTitle}</h3>
              <ContactForm locale={locale} dict={dict.form} compact className="mt-6" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
