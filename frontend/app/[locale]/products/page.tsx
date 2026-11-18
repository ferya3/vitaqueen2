import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ProductCard } from "@/components/products/product-card";
import { ProductCatalog } from "@/components/products/product-catalog";
import { getCategories, getProducts } from "@/lib/api/public";
import { loadPageContext } from "@/lib/i18n/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale, dict, settings } = await loadPageContext(params);
  return buildMetadata({ locale, settings, path: "/products", title: dict.nav.products, description: dict.products.text });
}

export default async function ProductsPage({ params }: PageProps<"/[locale]/products">) {
  const { locale, dict } = await loadPageContext(params);
  const [products, categories] = await Promise.all([getProducts(locale), getCategories(locale)]);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.products.eyebrow}
        title={dict.products.title}
        text={dict.products.text}
        crumbs={[{ name: dict.common.breadcrumbHome, path: "/" }, { name: dict.nav.products, path: "/products" }]}
      />
      <section className="container-x pt-8 pb-24">
        <ProductCatalog
          labels={dict.products.filters}
          emptyLabel={dict.products.empty}
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          items={products.map((p, i) => ({
            id: p.id,
            size: p.size_class,
            category: p.category?.slug ?? null,
            node: <ProductCard product={p} locale={locale} dict={dict} priority={i < 2} />,
          }))}
        />
      </section>
    </>
  );
}
