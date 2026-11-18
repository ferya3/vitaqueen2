import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { getPage } from "@/lib/api/public";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  const page = await getPage(locale, "privacy");
  return buildMetadata({ locale, settings, path: "/privacy", title: page?.title ?? dict.footer.privacy, description: page?.excerpt });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale, dict } = await loadPageContext(params);
  const page = await getPage(locale, "privacy");
  if (!page) notFound();
  return (
    <>
      <PageHero locale={locale} title={page.title} crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: page.title, path: "/privacy" }]} />
      <article className="container-x max-w-3xl pt-6 pb-24">
        {page.body && <div className="prose-content" dangerouslySetInnerHTML={{ __html: page.body }} />}
      </article>
    </>
  );
}
