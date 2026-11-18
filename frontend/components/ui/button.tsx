import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold transition-all duration-300 ease-[var(--ease-water)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-water-500 text-white shadow-[0_10px_30px_-10px_rgb(19_168_206/0.8)] hover:-translate-y-0.5 hover:bg-water-600 hover:shadow-[0_16px_40px_-12px_rgb(19_168_206/0.9)] active:translate-y-0",
        deep: "bg-deep-600 text-white hover:-translate-y-0.5 hover:bg-deep-700 hover:shadow-lift",
        outline: "border border-deep-600/15 bg-white text-deep-600 hover:-translate-y-0.5 hover:border-water-400 hover:text-water-700 hover:shadow-soft",
        glass: "glass text-white hover:-translate-y-0.5 hover:bg-white/20",
        ghost: "text-deep-600 hover:bg-deep-50",
        link: "rounded-none px-0 text-water-700 underline-offset-4 hover:underline",
        danger: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
