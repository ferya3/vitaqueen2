import localFont from "next/font/local";

// Self-hosted variable fonts (no Google Fonts request — faster, private, and
// reliable for visitors where Google services may be blocked).
// Vazirmatn's Arabic subset covers Persian/Arabic glyphs; Latin glyphs fall
// through to Inter in the font stack (see --font-sans in globals.css).
export const vazirmatn = localFont({
  src: "../app/fonts/Vazirmatn-Arabic.woff2",
  weight: "100 900",
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

export const inter = localFont({
  src: "../app/fonts/Inter-Latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
  preload: true,
});
