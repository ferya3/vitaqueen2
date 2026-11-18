import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin/constants";
import { API_URL, clearSessionCookie, clientHeaders, forbidden, isSameOrigin } from "@/lib/admin/server";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return forbidden();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (token) {
    await fetch(`${API_URL}/admin/auth/logout`, {
      method: "POST",
      headers: { ...clientHeaders(request), Authorization: `Bearer ${token}` },
    }).catch(() => null);
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
