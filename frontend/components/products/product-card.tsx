import { ArrowUpLeft, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottleIllustration } from "@/components/products/bottle-illustration";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import { formatNumber, formatVolume } from "@/lib/utils";
import type { Product } from "@/types/api";

export function ProductCard({ product, locale, dict, priority = false }: { product: Product; locale: Locale; dict: Dictionary; priority?: boolean }) {
  const accent = product.accent_color ?? "#13A8CE";

  return (
    <Link
      href={href(locale, `/products/${product.slug}`)}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft transition-all duration-500 ease-[var(--ease-water)] hover:-translate-y-1.5 hover:border-water-200 hover:shadow-lift"
    >
      <div
        className="relative flex aspect-[4/5] items-end justify-center overflow-hidden"
        style={{ background: `radial-gradient(70% 60% at 50% 70%, ${accent}26 0%, transparent 70%), linear-gradient(180deg, #f3f8fa 0%, #ffffff 100%)` }}
      >
        <span aria-hidden className="absolute bottom-10 size-40 rounded-full border border-water-200/60 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
        <div className="relative h-[82%] w-full transition-transform duration-700 ease-[var(--ease-water)] group-hover:-translate-y-3 group-hover:scale-[1.03]">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.alt ?? product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 80vw"
              className="object-contain object-bottom"
            />
          ) : (
            <div className="flex h-full justify-center pb-2">
              <BottleIllustration volume={product.volume_ml} accent={product.accent_color} material={product.bottle_material} label={product.name} />
            </div>
          )}
        </div>
        <Badge variant="deep" className="absolute start-4 top-4 text-sm">
          {formatVolume(product.volume_ml, locale)}
        </Badge>
        {product.bottle_material === "Glass" && (
          <Badge variant="muted" className="absolute end-4 top-4">
            Glass
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {product.category && <p className="text-xs font-semibold text-water-700">{product.category.name}</p>}
        <h3 className="mt-1.5 text-lg leading-snug">{product.name}</h3>
        {product.short_description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{product.short_description}</p>}
        <div className="mt-auto flex items-center justify-between pt-5">
          {product.units_per_pack ? (
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Package className="size-4 text-water-600" />
              {formatNumber(product.units_per_pack, locale)} {dict.products.perPack}
            </span>
          ) : (
            <span />
          )}
          <span className="grid size-10 place-items-center rounded-full bg-cloud text-deep-600 transition-all duration-500 group-hover:bg-water-500 group-hover:text-white">
            <ArrowUpLeft className="size-4 ltr:-scale-x-100" />
          </span>
        </div>
      </div>
    </Link>
  );
}
