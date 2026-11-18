import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/api/public";

export const alt = "Natural mineral water";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default Open Graph card (Latin text: the built-in OG font has no Persian glyphs).
export default async function OpengraphImage() {
  const settings = await getSettings("en");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "white",
          background: "linear-gradient(160deg, #052438 0%, #073B59 45%, #0b566b 100%)",
        }}
      >
        <svg width="96" height="96" viewBox="0 0 64 64">
          <path d="M32 4C32 4 10 28.4 10 41.5 10 53.4 19.8 62 32 62s22-8.6 22-20.5C54 28.4 32 4 32 4Z" fill="#13A8CE" />
        </svg>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 32 }}>{settings.site.name}</div>
        <div style={{ fontSize: 40, color: "#8DD9E9", marginTop: 12 }}>{settings.site.tagline}</div>
      </div>
    ),
    size,
  );
}
