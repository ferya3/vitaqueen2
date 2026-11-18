import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { href, type Locale } from "@/lib/i18n/config";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface Crumb {
  name: string;
  path: string;
}

interface PageHeroProps {
  locale: Locale;
  title: string;
  text?: string | null;
  eyebrow?: string;
  crumbs: Crumb[]; // first crumb should be home
  children?: React.ReactNode;
  className?: string;
}

/** Dark banner used at the top of inner pages (keeps the transparent header legible). */
export function PageHero({ locale, title, text, eyebrow, crumbs, children, className }: PageHeroProps) {
  return (
    <section className={cn("bg-water-mesh relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-20 text-white md:pb-28", className)}>
      <JsonLd data={breadcrumbJsonLd(crumbs, locale)} />
      <div aria-hidden className="pointer-events-none absolute -end-40 -top-40 size-[34rem] rounded-full border border-white/10" />
      <div aria-hidden className="pointer-events-none absolute -end-20 -top-20 size-[26rem] rounded-full border border-white/10" />
      <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-14 w-full text-white md:h-20">
        <path d="M0 60c180 40 360 60 720 20s540-40 720 0v40H0Z" fill="currentColor" />
      </svg>

      <div className="container-x relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            {crumbs.map((crumb, i) => (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronLeft className="size-3.5 ltr:rotate-180" aria-hidden />}
                {i < crumbs.length - 1 ? (
                  <Link href={href(locale, crumb.path)} className="hover:text-white">
                    {crumb.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/90">
                    {crumb.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="mt-8 text-sm font-semibold text-ice">{eyebrow}</p>}
        <h1 className={cn("max-w-3xl text-4xl text-white md:text-6xl md:leading-[1.15]", eyebrow ? "mt-3" : "mt-8")}>{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">{text}</p>}
        {children}
      </div>
    </section>
  );
}
