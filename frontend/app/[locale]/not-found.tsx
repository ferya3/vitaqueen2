import Link from "next/link";
import { BottleIllustration } from "@/components/products/bottle-illustration";
import { Button } from "@/components/ui/button";

// Rendered inside the [locale] layout. The locale is not available here, so the
// message is shown in Persian with an English line underneath.
export default function NotFound() {
  return (
    <section className="bg-water-mesh flex min-h-[80vh] items-center pt-[var(--header-h)] text-white">
      <div className="container-x flex flex-col items-center gap-6 py-20 text-center">
        <div className="h-48 opacity-90">
          <BottleIllustration volume={500} accent="#8DD9E9" />
        </div>
        <p className="font-latin text-7xl font-extrabold text-white/20">404</p>
        <h1 className="text-3xl text-white">صفحه پیدا نشد</h1>
        <p className="font-latin text-white/60">The page you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/">بازگشت به صفحه اصلی · Home</Link>
        </Button>
      </div>
    </section>
  );
}
