import { NextResponse, type NextRequest } from "next/server";
import { API_URL, clientHeaders, forbidden, isSameOrigin, setSessionCookie } from "@/lib/admin/server";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return forbidden();

  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_URL}/admin/auth/login?locale=fa`, {
    method: "POST",
    headers: { ...clientHeaders(request), "Content-Type": "application/json", "Accept-Language": "fa" },
    body: JSON.stringify({ email: body.email, password: body.password, device_name: "admin-panel" }),
  }).catch(() => null);

  if (!res) return NextResponse.json({ message: "سرور API در دسترس نیست." }, { status: 502 });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json(json, { status: res.status });

  // The token never reaches browser JavaScript: it lives in an httpOnly cookie.
  const response = NextResponse.json({ user: json.user, expires_at: json.expires_at });
  setSessionCookie(response, json.token, json.expires_at);
  return response;
}
