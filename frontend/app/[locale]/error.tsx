"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <section className="bg-water-mesh flex min-h-[70vh] items-center pt-[var(--header-h)] text-white">
      <div className="container-x flex flex-col items-center gap-5 py-20 text-center">
        <h1 className="text-3xl text-white">مشکلی پیش آمد · Something went wrong</h1>
        <p className="text-white/60">لطفاً دوباره تلاش کنید. Please try again.</p>
        <Button onClick={reset}>
          <RotateCcw />
          تلاش دوباره · Retry
        </Button>
      </div>
    </section>
  );
}
