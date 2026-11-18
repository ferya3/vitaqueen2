import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { CopyrightYear } from "@/components/layout/copyright-year";
import { Logo } from "@/components/layout/logo";
import { SocialLinks } from "@/components/layout/social-links";
import type { NavItem } from "@/components/navigation/nav-items";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import type { SiteSettings } from "@/types/api";

export function SiteFooter({ locale, dict, settings, items }: { locale: Locale; dict: Dictionary; settings: SiteSettings; items: (NavItem & { label: string })[] }) {
  const cooperation = [
    { label: dict.partnership.channels.agency.title, path: "/representatives" },
    { label: dict.partnership.channels.wholesale.title, path: "/representatives#wholesale" },
    { label: dict.footer.export, path: "/representatives#export" },
    { label: dict.nav.certificates, path: "/certificates" },
  ];

  return (
    <footer className="relative overflow-hidden bg-deep-900 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_0%,rgb(19_168_206/0.18),transparent_70%)]" />
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-10 w-full text-white">
        <path d="M0 0h1440v30c-240 40-480 50-720 30S240 20 0 40Z" fill="currentColor" />
      </svg>

      <div className="container-x relative grid gap-12 pt-24 pb-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo name={settings.site.name} tagline={settings.site.tagline} tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">{settings.site.description}</p>
          <SocialLinks social={settings.social} className="mt-6" />
        </div>

        <nav aria-label={dict.footer.quickLinks} className="lg:col-span-2">
          <h2 className="text-sm font-bold text-white">{dict.footer.quickLinks}</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {items.slice(0, 5).map((item) => (
              <li key={item.key}>
                <Link href={href(locale, item.path)} className="transition-colors hover:text-ice">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.cooperation} className="lg:col-span-2">
          <h2 className="text-sm font-bold text-white">{dict.footer.cooperation}</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {cooperation.map((item) => (
              <li key={item.path}>
                <Link href={href(locale, item.path)} className="transition-colors hover:text-ice">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="text-sm font-bold text-white">{dict.footer.contactUs}</h2>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-ice" />
              <span className="leading-7">{settings.contact.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-ice" />
              <a href={`tel:${settings.contact.phone.replace(/\s/g, "")}`} className="ltr-value hover:text-white">
                {settings.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-ice" />
              <a href={`mailto:${settings.contact.email}`} className="ltr-value hover:text-white">
                {settings.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-ice" />
              <span>{settings.contact.working_hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 md:flex-row">
          <p>
            © <CopyrightYear locale={locale} /> {settings.site.legal_name}. {dict.footer.rights}
          </p>
          <Link href={href(locale, "/privacy")} className="hover:text-white">
            {dict.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
