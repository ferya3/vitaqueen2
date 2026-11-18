import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";
import { inter, vazirmatn } from "@/lib/fonts";

export const instant = false;

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className="bg-cloud">
        {children}
        <Toaster position="top-center" richColors dir="rtl" toastOptions={{ style: { fontFamily: "var(--font-sans)" } }} />
      </body>
    </html>
  );
}
