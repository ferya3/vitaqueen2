import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin/constants";
import { API_URL, clearSessionCookie, clientHeaders, forbidden, isSameOrigin } from "@/lib/admin/server";

/**
 * Backend-for-frontend proxy: /api/admin/* -> Laravel /api/v1/admin/*
 * Adds the bearer token from the httpOnly cookie, so the admin SPA never
 * handles the token directly. Supports JSON, multipart uploads and file downloads.
 */
async function proxy(request: NextRequest, ctx: RouteContext<"/api/admin/[...path]">) {
  if (!isSameOrigin(request)) return forbidden();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });

  const { path } = await ctx.params;
  if (path.some((segment) => segment === ".." || segment.includes("\\"))) {
    return NextResponse.json({ message: "Bad path." }, { status: 400 });
  }

  const target = `${API_URL}/admin/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers: Record<string, string> = { ...clientHeaders(request), Authorization: `Bearer ${token}`, "Accept-Language": "fa" };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    // @ts-expect-error -- required by Node fetch when streaming a request body
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
  }).catch(() => null);

  if (!upstream) return NextResponse.json({ message: "سرور API در دسترس نیست." }, { status: 502 });

  const responseHeaders = new Headers();
  for (const h of ["content-type", "content-disposition", "cache-control"]) {
    const v = upstream.headers.get(h);
    if (v) responseHeaders.set(h, v);
  }
  responseHeaders.set("Cache-Control", "no-store");

  const response = new NextResponse(upstream.status === 204 ? null : upstream.body, { status: upstream.status, headers: responseHeaders });
  if (upstream.status === 401) clearSessionCookie(response);
  return response;
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
