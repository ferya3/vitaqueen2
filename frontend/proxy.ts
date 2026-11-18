import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

/**
 * 1. Admin gate: optimistic check for the session cookie (the Laravel API is
 *    still the source of truth for every request).
 * 2. Locale routing: "/" and un-prefixed paths redirect to the best locale
 *    (cookie → Accept-Language → fa).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const authed = request.cookies.has(ADMIN_COOKIE);
    if (!authed && pathname !== "/admin/login") {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (authed && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    const res = NextResponse.next();
    if (request.cookies.get("NEXT_LOCALE")?.value !== first) {
      res.cookies.set("NEXT_LOCALE", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

function preferredLocale(request: NextRequest) {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  return ranked.find((r) => (locales as readonly string[]).includes(r.lang))?.lang ?? defaultLocale;
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (icons, images, fonts…)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
