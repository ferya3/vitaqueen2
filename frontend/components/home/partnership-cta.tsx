import { ArrowUpLeft, Check, Handshake } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";

export function PartnershipCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="container-x py-10 md:py-16">
      <Reveal>
        <div className="bg-water-mesh relative overflow-hidden rounded-[2rem] px-6 py-14 text-white md:px-14 md:py-20">
          <div aria-hidden className="absolute -end-24 -bottom-24 size-[28rem] rounded-full border border-white/10" />
          <div aria-hidden className="absolute -end-10 -bottom-10 size-[20rem] rounded-full border border-white/10" />
          <Handshake aria-hidden className="absolute end-10 top-10 hidden size-28 text-white/10 md:block" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="glass inline-flex rounded-full px-3 py-1 text-xs font-semibold text-ice">{dict.partnership.eyebrow}</span>
              <h2 className="mt-5 text-3xl text-white md:text-5xl md:leading-[1.2]">{dict.partnership.title}</h2>
              <p className="mt-5 max-w-lg text-white/70 md:text-lg">{dict.partnership.text}</p>
              <Button asChild size="lg" className="mt-8">
                <Link href={href(locale, "/representatives#apply")}>
                  {dict.partnership.cta}
                  <ArrowUpLeft className="ltr:-scale-x-100" />
                </Link>
              </Button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {dict.partnership.benefits.map((benefit) => (
                <li key={benefit} className="glass flex items-center gap-3 rounded-2xl p-4 text-sm font-medium">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-water-500 text-white">
                    <Check className="size-4" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
