import { ArrowDown, ArrowUpLeft, Play } from "lucide-react";
import Link from "next/link";
import { HeroTitle } from "@/components/hero/hero-title";
import { WaterCanvas } from "@/components/hero/water-canvas";
import { BottleShowcase } from "@/components/products/bottle-showcase";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import type { Product, SiteSettings } from "@/types/api";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
  product?: Product;
}

export function Hero({ locale, dict, settings, product }: HeroProps) {
  const video = settings.hero.video_url;

  return (
    <section className="bg-water-mesh relative isolate flex min-h-[100svh] items-center overflow-hidden text-white">
      {video ? (
        <video
          className="absolute inset-0 -z-10 size-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={settings.hero.poster_url ?? undefined}
          aria-hidden
        >
          <source src={video} />
        </video>
      ) : null}
      <WaterCanvas className="absolute inset-0 -z-10 size-full" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-deep-900/40 via-transparent to-deep-900/30" />

      {/* concentric ripples */}
      <div aria-hidden className="pointer-events-none absolute end-[8%] top-1/2 -z-10 hidden -translate-y-1/2 lg:block">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute -start-64 -top-64 size-[32rem] rounded-full border border-white/15 motion-safe:animate-ripple"
            style={{ animationDelay: `${i}s` }}
          />
        ))}
      </div>

      <div className="container-x grid items-center gap-8 pt-[calc(var(--header-h)+2rem)] pb-28 lg:grid-cols-12 lg:pb-16">
        <div className="lg:col-span-7">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-ice">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-ice opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-ice" />
            </span>
            {dict.hero.badge}
          </span>

          <HeroTitle text={settings.hero.title} className="mt-6 text-[2.6rem] leading-[1.2] font-extrabold text-white sm:text-6xl lg:text-7xl lg:leading-[1.12]" />

          <p className="mt-6 max-w-xl text-base leading-8 text-white/75 md:text-lg">{settings.hero.subtitle}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={href(locale, "/products")}>
                {dict.common.viewProducts}
                <ArrowUpLeft className="ltr:-scale-x-100" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="glass">
              <Link href={href(locale, "/about")}>
                <Play className="fill-current" />
                {dict.common.aboutFactory}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[46vh] min-h-[320px] lg:col-span-5 lg:h-[70vh]">
          <div aria-hidden className="absolute inset-x-10 bottom-6 h-24 rounded-[100%] bg-water-400/30 blur-3xl" />
          <BottleShowcase
            volume={product?.volume_ml ?? 500}
            accent={product?.accent_color}
            brand={settings.site.name}
            label={product?.name}
            className="size-full"
          />
        </div>
      </div>

      <a
        href="#brand"
        className="absolute bottom-8 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/60 transition-colors hover:text-white md:flex rtl:translate-x-1/2"
      >
        {dict.hero.scroll}
        <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-white/30 p-1">
          <ArrowDown className="size-3.5 motion-safe:animate-bounce" />
        </span>
      </a>

      <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-16 w-full text-white md:h-24">
        <path d="M0 64c160 32 320 48 560 24S1040 0 1240 24s200 40 200 40v56H0Z" fill="currentColor" />
      </svg>
    </section>
  );
}
