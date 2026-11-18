import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      water: "bg-water-50 text-water-700 ring-1 ring-water-200/60",
      deep: "bg-deep-600 text-white",
      success: "bg-success/10 text-success ring-1 ring-success/20",
      danger: "bg-danger/10 text-danger ring-1 ring-danger/20",
      warning: "bg-warning/10 text-[#9a6b00] ring-1 ring-warning/30",
      muted: "bg-cloud text-muted ring-1 ring-line",
      glass: "glass text-white",
    },
  },
  defaultVariants: { variant: "water" },
});

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
