import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldBase =
  "w-full rounded-2xl border border-line bg-white px-4 text-[0.95rem] text-ink shadow-[inset_0_1px_2px_rgb(7_59_89/0.04)] transition-colors placeholder:text-muted/60 hover:border-deep-100 focus:border-water-400 focus:outline-none focus:ring-4 focus:ring-water-100 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/10 disabled:cursor-not-allowed disabled:bg-cloud";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input" className={cn(fieldBase, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldBase, "min-h-32 py-3 leading-7", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(fieldBase, "h-12 appearance-none pe-10", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-muted"
      >
        <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="label" className={cn("mb-2 block text-sm font-semibold text-deep-600", className)} {...props} />;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
      {message}
    </p>
  );
}
