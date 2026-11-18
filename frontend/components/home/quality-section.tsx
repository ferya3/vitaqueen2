import { ArrowUpLeft, CheckCircle2, Microscope } from "lucide-react";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { CertificateCard } from "@/components/quality/certificate-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import type { Certificate } from "@/types/api";

export function QualitySection({ locale, dict, certificates }: { locale: Locale; dict: Dictionary; certificates: Certificate[] }) {
  return (
    <section className="section-y relative">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={dict.quality.eyebrow} title={dict.quality.title} text={dict.quality.text} />
          <Reveal delay={0.15} className="mt-8 overflow-hidden rounded-[var(--radius-card)] bg-deep-600 p-7 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-water-500/20 text-ice">
                <Microscope className="size-6" />
              </span>
              <h3 className="text-lg text-white">{dict.quality.labTitle}</h3>
            </div>
            <ul className="mt-6 space-y-3">
              {dict.quality.labPoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-7 text-white/75">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-ice" />
                  {point}
                </li>
              ))}
            </ul>
            <Button asChild variant="glass" className="mt-8">
              <Link href={href(locale, "/quality")}>
                {dict.common.learnMore}
                <ArrowUpLeft className="ltr:-scale-x-100" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Stagger className="grid content-start gap-5 sm:grid-cols-2 lg:col-span-7">
          {certificates.slice(0, 4).map((c) => (
            <StaggerItem key={c.id}>
              <CertificateCard certificate={c} locale={locale} dict={dict} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
