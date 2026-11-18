import { CalendarDays, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { ArticleCard } from "@/components/news/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getArticle, getSitemapData } from "@/lib/api/public";
import { locales } from "@/lib/i18n/config";
import { loadPageContext } from "@/lib/i18n/page";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { formatDate, formatNumber, stripHtml, truncate } from "@/lib/utils";

// Detail pages may block on the first visit of a slug added after the build
// (new CMS content renders fully, then is cached). Unknown slugs render the
// not-found UI with <meta name="robots" content="noindex"> (streamed responses
// start with HTTP 200 under Cache Components — see docs/architecture/frontend.md).
export const instant = false;

export async function generateStaticParams() {
  const { articles } = await getSitemapData();
  return locales.flatMap((locale) => articles.slice(0, 20).map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/news/[slug]">): Promise<Metadata> {
  const { locale, settings } = await loadPageContext(params);
  const { slug } = await params;
  const res = await getArticle(locale, slug);
  if (!res) return {};
  const a = res.data;
  return buildMetadata({
    locale,
    settings,
    path: `/news/${a.slug}`,
    title: a.meta_title || a.title,
    description: a.meta_description || a.excerpt || truncate(stripHtml(a.body)),
    image: a.cover_url,
    type: "article",
  });
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/news/[slug]">) {
  const { locale, dict, settings } = await loadPageContext(params);
  const { slug } = await params;
  const res = await getArticle(locale, slug);
  if (!res) notFound();
  const { data: article, related } = res;

  return (
    <>
      <JsonLd data={articleJsonLd(article, settings, locale)} />
      <PageHero
        locale={locale}
        eyebrow={dict.news.types[article.type]}
        title={article.title}
        text={article.excerpt}
        crumbs={[
          { name: dict.common.breadcrumbHome, path: "/" },
          { name: dict.nav.news, path: "/news" },
          { name: article.title, path: `/news/${article.slug}` },
        ]}
      >
        <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/60">
          {article.published_at && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              <time dateTime={article.published_at}>{formatDate(article.published_at, locale)}</time>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {formatNumber(article.reading_minutes, locale)} {dict.common.minutesRead}
          </span>
        </div>
      </PageHero>

      <article className="container-x max-w-3xl pt-6 pb-20">
        {article.cover_url && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
            <Image src={article.cover_url} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        {article.body && <div className="prose-content" dangerouslySetInnerHTML={{ __html: article.body }} />}
      </article>

      {related.length > 0 && (
        <section className="section-y bg-cloud">
          <div className="container-x">
            <h2 className="text-2xl">{dict.news.related}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
