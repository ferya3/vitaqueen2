import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { ArticleCard } from "@/components/news/article-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import type { Article } from "@/types/api";

export function NewsSection({ locale, dict, articles }: { locale: Locale; dict: Dictionary; articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className="section-y">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={dict.news.eyebrow} title={dict.news.title} />
          <Button asChild variant="outline">
            <Link href={href(locale, "/news")}>
              {dict.common.viewAll}
              <ArrowUpLeft className="ltr:-scale-x-100" />
            </Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {articles.map((a) => (
            <StaggerItem key={a.id}>
              <ArticleCard article={a} locale={locale} dict={dict} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
