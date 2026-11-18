"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Filter = "all" | "small" | "medium" | "large" | `cat:${string}`;

interface CatalogItem {
  id: number;
  size: "small" | "medium" | "large";
  category: string | null;
  node: React.ReactNode;
}

/**
 * Client-side filtering of server-rendered product cards (cards stay server
 * components; only the visibility logic runs in the browser).
 */
export function ProductCatalog({
  items,
  labels,
  categories,
  emptyLabel,
}: {
  items: CatalogItem[];
  labels: Record<"all" | "small" | "medium" | "large", string>;
  categories: { slug: string; name: string }[];
  emptyLabel: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filters = useMemo(() => {
    const sizes = (["small", "medium", "large"] as const).filter((s) => items.some((i) => i.size === s));
    return [
      { key: "all" as Filter, label: labels.all },
      ...sizes.map((s) => ({ key: s as Filter, label: labels[s] })),
      ...categories.filter((c) => items.some((i) => i.category === c.slug)).map((c) => ({ key: `cat:${c.slug}` as Filter, label: c.name })),
    ];
  }, [items, labels, categories]);

  const visible = items.filter((i) =>
    filter === "all" ? true : filter.startsWith("cat:") ? i.category === filter.slice(4) : i.size === filter,
  );

  return (
    <div>
      <div role="tablist" aria-label="Filter" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
        {filters.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              filter === f.key ? "text-white" : "bg-cloud text-deep-600 hover:bg-deep-50",
            )}
          >
            {filter === f.key && <motion.span layoutId="catalog-pill" className="absolute inset-0 rounded-full bg-deep-600" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              {item.node}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {visible.length === 0 && <p className="py-16 text-center text-muted">{emptyLabel}</p>}
    </div>
  );
}
