import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { ArticleCard } from "@/components/news/article-card";
import { getArticles } from "@/lib/api/public";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";
import { cn, formatNumber } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  return buildMetadata({ locale, settings, path: "/news", title: dict.nav.news, description: dict.news.text });
}

type NewsType = "news" | "article" | undefined;

async function ArticleList({ locale, dict, searchParams }: { locale: Locale; dict: Dictionary; searchParams: PageProps<"/[locale]/news">["searchParams"] }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const type: NewsType = sp.type === "news" || sp.type === "article" ? sp.type : undefined;
  const { data, meta } = await getArticles(locale, page, type);
  const query = (p: number, t: NewsType = type) => {
    const q = new URLSearchParams();
    if (p > 1) q.set("page", String(p));
    if (t) q.set("type", t);
    const s = q.toString();
    return `${href(locale, "/news")}${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <div className="flex gap-2">
        {([undefined, "news", "article"] as NewsType[]).map((t) => (
          <Link
            key={t ?? "all"}
            href={query(1, t)}
            className={cn("rounded-full px-5 py-2.5 text-sm font-semibold", type === t ? "bg-deep-600 text-white" : "bg-cloud text-deep-600 hover:bg-deep-50")}
          >
            {t ? dict.news.types[t] : dict.common.all}
          </Link>
        ))}
      </div>
      {data.length === 0 ? (
        <p className="py-20 text-center text-muted">{dict.news.empty}</p>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} dict={dict} />
          ))}
        </div>
      )}
      {meta.last_page > 1 && (
        <nav aria-label={dict.common.page} className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={query(p)}
              aria-current={p === meta.current_page ? "page" : undefined}
              className={cn("grid size-11 place-items-center rounded-full text-sm font-semibold", p === meta.current_page ? "bg-water-500 text-white" : "bg-cloud text-deep-600 hover:bg-deep-50")}
            >
              {formatNumber(p, locale)}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}

export default async function NewsPage({ params, searchParams }: PageProps<"/[locale]/news">) {
  const { locale, dict } = await loadPageContext(params);
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.news.eyebrow}
        title={dict.news.title}
        text={dict.news.text}
        crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: dict.nav.news, path: "/news" }]}
      />
      <section className="container-x pt-8 pb-24">
        <Suspense
          fallback={
            <div className="mt-20 grid gap-5 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-96 rounded-[var(--radius-card)]" />
              ))}
            </div>
          }
        >
          <ArticleList locale={locale} dict={dict} searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
