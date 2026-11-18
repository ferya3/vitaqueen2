import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { inter, vazirmatn } from "@/lib/fonts";

export const metadata: Metadata = { title: "404 — Not found" };

export default function GlobalNotFound() {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className="bg-water-mesh flex min-h-screen items-center justify-center text-center text-white">
        <main className="space-y-4 p-6">
          <p className="font-latin text-8xl font-extrabold text-white/20">404</p>
          <h1 className="text-3xl text-white">صفحه پیدا نشد</h1>
          <p className="font-latin text-white/60">Page not found</p>
          <Link href="/" className="inline-block rounded-full bg-water-500 px-6 py-3 font-semibold">
            صفحه اصلی · Home
          </Link>
        </main>
      </body>
    </html>
  );
}
