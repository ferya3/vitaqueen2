"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function FormSuccess({ title, message, reference, referenceLabel, resetLabel, onReset }: {
  title: string;
  message: string;
  reference: string;
  referenceLabel: string;
  resetLabel: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-3xl bg-water-50 px-6 py-12 text-center"
    >
      <span className="relative grid size-16 place-items-center rounded-full bg-success text-white">
        <span className="absolute inset-0 rounded-full bg-success/40 motion-safe:animate-ping" />
        <CheckCircle2 className="relative size-8" />
      </span>
      <h3 className="mt-6 text-xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-7 text-muted">{message}</p>
      {reference && (
        <p className="mt-4 rounded-full bg-white px-4 py-1.5 text-sm">
          {referenceLabel}: <strong className="ltr-value text-deep-600">{reference}</strong>
        </p>
      )}
      <Button variant="outline" size="sm" className="mt-6" onClick={onReset}>
        {resetLabel}
      </Button>
    </motion.div>
  );
}

/** Invisible to humans; bots that fill every field are rejected by the API. */
export function Honeypot({ register }: { register: (name: "website") => object }) {
  return (
    <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </label>
    </div>
  );
}
