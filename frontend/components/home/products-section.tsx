import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { href, type Locale } from "@/lib/i18n/config";
import type { Product } from "@/types/api";

export function ProductsSection({ locale, dict, products }: { locale: Locale; dict: Dictionary; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="section-y relative overflow-hidden bg-cloud">
      <div aria-hidden className="pointer-events-none absolute -start-40 top-20 size-96 rounded-full bg-water-200/30 blur-3xl" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={dict.products.eyebrow} title={dict.products.title} text={dict.products.text} />
          <Button asChild variant="outline">
            <Link href={href(locale, "/products")}>
              {dict.common.viewAll}
              <ArrowUpLeft className="ltr:-scale-x-100" />
            </Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} locale={locale} dict={dict} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
