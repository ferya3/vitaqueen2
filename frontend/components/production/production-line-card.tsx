import { Cpu, Gauge, Ruler } from "lucide-react";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { formatNumber, formatVolume } from "@/lib/utils";
import type { ProductionLine } from "@/types/api";

export function ProductionLineCard({ line, locale, dict }: { line: ProductionLine; locale: Locale; dict: Dictionary }) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft">
      {line.image_url && (
        <div className="relative aspect-[16/8]">
          <Image src={line.image_url} alt={line.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="p-7">
        <h3 className="text-xl">{line.name}</h3>
        {line.description && <p className="mt-2 leading-7 text-muted">{line.description}</p>}
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-cloud p-4">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <Gauge className="size-4 text-water-600" />
              {dict.production.capacity}
            </dt>
            <dd className="mt-1 text-sm font-bold text-deep-600">
              {line.capacity_per_hour ? `${formatNumber(line.capacity_per_hour, locale)} ${dict.production.perHour}` : dict.common.pending}
            </dd>
          </div>
          <div className="rounded-2xl bg-cloud p-4">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <Ruler className="size-4 text-water-600" />
              {dict.production.sizes}
            </dt>
            <dd className="mt-1 text-sm font-bold text-deep-600">{line.bottle_sizes.map((s) => formatVolume(s, locale)).join(locale === "en" ? ", " : "، ")}</dd>
          </div>
          {line.technology && (
            <div className="rounded-2xl bg-cloud p-4">
              <dt className="flex items-center gap-1.5 text-xs text-muted">
                <Cpu className="size-4 text-water-600" />
                {dict.production.technology}
              </dt>
              <dd className="mt-1 text-sm font-bold text-deep-600">{line.technology}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}
