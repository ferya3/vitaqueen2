import { Award, Download, FileCheck2, FlaskConical } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { cn, formatDate } from "@/lib/utils";
import type { Certificate } from "@/types/api";

const icons = { certificate: Award, lab_report: FlaskConical, standard: FileCheck2 };

export function CertificateCard({ certificate, locale, dict, tone = "light" }: { certificate: Certificate; locale: Locale; dict: Dictionary; tone?: "light" | "dark" }) {
  const Icon = icons[certificate.type] ?? Award;
  const dark = tone === "dark";

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-[var(--radius-card)] border p-6 transition-all duration-500 hover:-translate-y-1",
        dark ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-line bg-white shadow-soft hover:shadow-lift",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {certificate.image_url ? (
          <div className="relative size-16 overflow-hidden rounded-2xl border border-line bg-white">
            <Image src={certificate.image_url} alt={certificate.title} fill sizes="64px" className="object-contain p-1" />
          </div>
        ) : (
          <span className={cn("grid size-14 place-items-center rounded-2xl", dark ? "bg-water-500/20 text-ice" : "bg-water-50 text-water-600")}>
            <Icon className="size-7" />
          </span>
        )}
        <Badge variant={dark ? "glass" : "muted"}>{dict.quality.types[certificate.type]}</Badge>
      </div>

      <h3 className={cn("mt-5 text-lg leading-snug", dark && "text-white")}>{certificate.title}</h3>
      {certificate.issuer && (
        <p className={cn("mt-1 text-sm", dark ? "text-white/60" : "text-muted")}>
          {dict.quality.issuer}: {certificate.issuer}
        </p>
      )}

      <dl className={cn("mt-4 space-y-1.5 text-xs", dark ? "text-white/60" : "text-muted")}>
        {certificate.certificate_number && (
          <div className="flex gap-2">
            <dt>{dict.quality.number}:</dt>
            <dd className="ltr-value">{certificate.certificate_number}</dd>
          </div>
        )}
        {certificate.issued_at && (
          <div className="flex gap-2">
            <dt>{dict.quality.issued}:</dt>
            <dd>{formatDate(certificate.issued_at, locale, { dateStyle: "medium" })}</dd>
          </div>
        )}
        {certificate.expires_at && (
          <div className="flex items-center gap-2">
            <dt>{dict.quality.expires}:</dt>
            <dd>{formatDate(certificate.expires_at, locale, { dateStyle: "medium" })}</dd>
            <Badge variant={certificate.is_expired ? "danger" : "success"}>{certificate.is_expired ? dict.quality.expired : dict.quality.valid}</Badge>
          </div>
        )}
      </dl>

      <div className="mt-auto pt-6">
        {certificate.file_url ? (
          <a
            href={certificate.file_url}
            target="_blank"
            rel="noopener"
            download
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              dark ? "bg-white/10 text-white hover:bg-water-500" : "bg-cloud text-deep-600 hover:bg-water-500 hover:text-white",
            )}
          >
            <Download className="size-4" />
            {dict.common.downloadPdf}
          </a>
        ) : (
          <span className={cn("text-xs", dark ? "text-white/40" : "text-muted/70")}>{dict.quality.noFile}</span>
        )}
      </div>
    </article>
  );
}
