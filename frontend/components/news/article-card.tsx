import { ArrowUpLeft, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Article } from "@/types/api";

export function ArticleCard({ article, locale, dict }: { article: Article; locale: Locale; dict: Dictionary }) {
  return (
    <Link
      href={href(locale, `/news/${article.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="bg-water-mesh relative aspect-[16/10] overflow-hidden">
        {article.cover_url ? (
          <Image src={article.cover_url} alt="" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <svg aria-hidden viewBox="0 0 400 250" className="absolute inset-0 size-full opacity-60 transition-transform duration-700 group-hover:scale-105">
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx="300" cy="190" r={40 + i * 45} fill="none" stroke="#8DD9E9" strokeOpacity={0.35 - i * 0.07} />
            ))}
            <path d="M300 120c0 0-30 34-30 52a30 30 0 0060 0c0-18-30-52-30-52Z" fill="#8DD9E9" fillOpacity="0.5" />
          </svg>
        )}
        <Badge variant="glass" className="absolute start-4 top-4">
          {dict.news.types[article.type]}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4 text-xs text-muted">
          {article.published_at && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              <time dateTime={article.published_at}>{formatDate(article.published_at, locale)}</time>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatNumber(article.reading_minutes, locale)} {dict.common.minutesRead}
          </span>
        </div>
        <h3 className="mt-3 text-lg leading-snug transition-colors group-hover:text-water-700">{article.title}</h3>
        {article.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{article.excerpt}</p>}
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-water-700">
          {dict.common.readMore}
          <ArrowUpLeft className="size-4 ltr:-scale-x-100" />
        </span>
      </div>
    </Link>
  );
}
