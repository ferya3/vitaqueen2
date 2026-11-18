import "server-only";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

export const API_URL = (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, "");

export const secureCookie = process.env.NODE_ENV === "production" || process.env.ADMIN_COOKIE_SECURE === "true";

/**
 * CSRF protection for cookie-authenticated mutations: the request must come from
 * our own origin. (The cookie is also SameSite=Strict.)
 */
export function isSameOrigin(request: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = request.headers.get("origin");
  if (!origin) return site === "same-origin";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function forbidden() {
  return NextResponse.json({ message: "Cross-site request blocked." }, { status: 403 });
}

export function clientHeaders(request: NextRequest) {
  const headers: Record<string, string> = { Accept: "application/json" };
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
  if (ip) headers["X-Forwarded-For"] = ip;
  const ua = request.headers.get("user-agent");
  if (ua) headers["User-Agent"] = ua;
  return headers;
}

export function setSessionCookie(response: NextResponse, token: string, expiresAt?: string | null) {
  const maxAge = expiresAt ? Math.max(60, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)) : 60 * 60 * 8;
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "strict",
    path: "/",
    maxAge,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: secureCookie, sameSite: "strict", path: "/", maxAge: 0 });
}
