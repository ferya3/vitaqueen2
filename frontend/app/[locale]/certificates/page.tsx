import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CertificateGroups } from "@/components/quality/certificate-groups";
import { getCertificates } from "@/lib/api/public";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/certificates">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  return buildMetadata({ locale, settings, path: "/certificates", title: dict.nav.certificates, description: dict.quality.text });
}

export default async function CertificatesPage({ params }: PageProps<"/[locale]/certificates">) {
  const { locale, dict } = await loadPageContext(params);
  const certificates = await getCertificates(locale);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.quality.eyebrow}
        title={dict.nav.certificates}
        text={dict.quality.text}
        crumbs={[
          { name: dict.common.breadcrumbHome, path: "/" },
          { name: dict.nav.quality, path: "/quality" },
          { name: dict.nav.certificates, path: "/certificates" },
        ]}
      />
      <section className="container-x pt-10 pb-24">
        <CertificateGroups certificates={certificates} locale={locale} dict={dict} />
      </section>
    </>
  );
}
